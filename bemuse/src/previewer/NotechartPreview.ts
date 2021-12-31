import Notechart, { GameNote, SoundedEvent } from 'bemuse-notechart'
import SamplingMaster, { Sample } from 'bemuse/sampling-master'
import _ from 'lodash'

export interface NotechartPreview {
  /**
   * Song’s length in seconds.
   */
  duration: number

  name: string
  description: string

  getViewport(currentTime: number, hiSpeed: number): PreviewViewport
  getCurrentBpm(currentTime: number): number
  play(delegate: NotechartPreviewPlayerDelegate): NotechartPreviewPlayer
}

export interface PreviewViewport {
  visibleNotes: VisibleNote[]
  visibleBarLines: number[]
}

export interface NotechartPreviewPlayer {
  stop(): void
}

export interface NotechartPreviewPlayerDelegate {
  startTime: number

  onFinish(): void
  onTimeUpdate(currentTime: number): void
}

export type VisibleNote = {
  y: number
  long?: { endY: number }
  gameNote: GameNote
}

export function createNullNotechartPreview(): NotechartPreview {
  return {
    duration: 0.99,
    name: 'No BMS/bmson loaded',
    description:
      'Drop a folder with BMS/bmson files into this window to preview it.',
    getViewport: () => ({
      visibleBarLines: [],
      visibleNotes: [],
    }),
    getCurrentBpm: () => 0,
    play: (delegate) => {
      setTimeout(() => {
        delegate.onFinish()
      })
      return { stop: () => {} }
    },
  }
}

export type PreviewSoundSample = {
  filename: string
  sample: Sample | null
}

export function createNotechartPreview(
  notechart: Notechart,
  filename: string,
  samplingMaster: SamplingMaster,
  samples: PreviewSoundSample[]
): NotechartPreview {
  return new BemuseNotechartPreview(
    notechart,
    filename,
    samplingMaster,
    samples
  )
}

class BemuseNotechartPreview implements NotechartPreview {
  private _sortedGameNotes: GameNote[]
  private _sortedSoundEvents: SoundedEvent[]

  constructor(
    private _notechart: Notechart,
    private _filename: string,
    private _samplingMaster: SamplingMaster,
    private _samples: PreviewSoundSample[]
  ) {
    this._sortedGameNotes = _.sortBy(this._notechart.notes, (e) => e.position)
    this._sortedSoundEvents = _.sortBy(
      [...this._notechart.notes, ...this._notechart.autos],
      (e) => e.time
    )
  }

  get duration() {
    return this._notechart.duration
  }

  get name() {
    return this._filename
  }

  get description() {
    return this._notechart.songInfo.title
  }

  getViewport(currentTime: number, hiSpeed: number): PreviewViewport {
    const beat = this._notechart.secondsToBeat(currentTime)
    const position = this._notechart.beatToPosition(beat)
    const speed = this._notechart.spacingAtBeat(beat)
    const windowSize = 4 / speed / hiSpeed
    const visibleNotes: VisibleNote[] = []
    const insideView = (gameNote: GameNote) => {
      if (gameNote.end) {
        if (gameNote.position > position + windowSize * 1.5) return false
        if (gameNote.end.position < position - windowSize * 0.5) return false
        return true
      } else {
        if (gameNote.position > position + windowSize * 1.5) return false
        if (gameNote.position < position - windowSize * 0.5) return false
        return true
      }
    }
    for (const gameNote of this._sortedGameNotes) {
      if (!insideView(gameNote)) continue
      const delta = gameNote.position - position
      const y = delta / windowSize
      const visibleNote: VisibleNote = {
        gameNote,
        y,
      }
      if (gameNote.end) {
        const endDelta = gameNote.end.position - position
        const endY = endDelta / windowSize
        visibleNote.long = { endY }
      }
      visibleNotes.push(visibleNote)
    }
    const visibleBarLines: number[] = []
    for (const barLine of this._notechart.barLines) {
      if (barLine.position > position + windowSize * 1.5) continue
      if (barLine.position < position - windowSize * 0.5) continue
      const delta = barLine.position - position
      visibleBarLines.push(delta / windowSize)
    }
    return { visibleNotes, visibleBarLines }
  }

  getCurrentBpm(currentTime: number): number {
    return this._notechart.bpmAtBeat(this._notechart.secondsToBeat(currentTime))
  }

  play(delegate: NotechartPreviewPlayerDelegate) {
    this._samplingMaster.unmute()
    console.log(this._sortedSoundEvents)
    console.log(this._notechart.keysounds)
    const player = new BemuseNotechartPreviewPlayer(
      this._samplingMaster,
      this._sortedSoundEvents,
      this._notechart.keysounds,
      this._samples,
      delegate
    )
    player.play()
    return player
  }
}

class BemuseNotechartPreviewPlayer implements NotechartPreviewPlayer {
  private _cursor = 0
  private _sampleMap = new Map<string, Sample>()
  private _startAudioTime = 0
  private _startSongTime = 0
  private _stopped = false

  constructor(
    private _samplingMaster: SamplingMaster,
    private _sortedSoundEvents: SoundedEvent[],
    private _keysounds: Record<string, string>,
    _samples: PreviewSoundSample[],
    private _delegate: NotechartPreviewPlayerDelegate
  ) {
    for (const { filename, sample } of _samples) {
      if (sample) {
        this._sampleMap.set(filename, sample)
      }
    }
  }

  play() {
    this._startAudioTime = this._samplingMaster.currentTime
    this._startSongTime = this._delegate.startTime
    const frame = () => {
      if (this._stopped) return
      this._advance()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  private _advance() {
    const currentTime =
      this._samplingMaster.currentTime -
      this._startAudioTime +
      this._startSongTime
    for (; this._cursor < this._sortedSoundEvents.length; this._cursor++) {
      const nextEvent = this._sortedSoundEvents[this._cursor]
      if (nextEvent.time > currentTime + 0.1) {
        break
      }

      if (nextEvent.keysoundStart) {
        // bmson’s "continue" notes do not trigger a new sound
        continue
      }

      const keysound = nextEvent.keysound
      const filename = this._keysounds[keysound.toLowerCase()]
      if (!filename) {
        continue
      }

      const sample = this._sampleMap.get(filename)
      if (!sample) {
        continue
      }

      let delay = 0
      let offset = 0
      if (nextEvent.time > currentTime) {
        delay = nextEvent.time - currentTime
      } else if (nextEvent.time < currentTime) {
        offset = currentTime - nextEvent.time
      }

      if (offset >= sample.duration) {
        continue
      }
      sample.play(delay, { start: offset })
    }
    this._delegate.onTimeUpdate(currentTime)
  }

  stop() {
    this._stopped = true
  }
}
