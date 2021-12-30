import Notechart, { GameNote } from 'bemuse-notechart'
import _ from 'lodash'

export interface NotechartPreview {
  /**
   * Song’s length in seconds.
   */
  duration: number

  name: string
  description: string

  getVisibleNotes(currentTime: number, hiSpeed: number): VisibleNote[]
  getCurrentBpm(currentTime: number): number
}

export type VisibleNote = {
  y: number
  long?: { height: number }
  gameNote: GameNote
}

export function createNullNotechartPreview(): NotechartPreview {
  return {
    duration: 0.99,
    name: 'No BMS/bmson loaded',
    description:
      'Drop a folder with BMS/bmson files into this window to preview it.',
    getVisibleNotes: () => [],
    getCurrentBpm: () => 0,
  }
}

export function createNotechartPreview(
  notechart: Notechart,
  filename: string
): NotechartPreview {
  return new BemuseNotechartPreview(notechart, filename)
}

class BemuseNotechartPreview implements NotechartPreview {
  private _sortedGameNotes: GameNote[]

  constructor(private _notechart: Notechart, private _filename: string) {
    this._sortedGameNotes = _.sortBy(this._notechart.notes, (e) => e.position)
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

  getVisibleNotes(currentTime: number, hiSpeed: number): VisibleNote[] {
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
        const endDelta = gameNote.end.position - gameNote.position
        const endY = endDelta / windowSize
        visibleNote.long = { height: endY - y }
      }
      visibleNotes.push(visibleNote)
    }
    return visibleNotes
  }

  getCurrentBpm(currentTime: number): number {
    return this._notechart.bpmAtBeat(this._notechart.secondsToBeat(currentTime))
  }
}
