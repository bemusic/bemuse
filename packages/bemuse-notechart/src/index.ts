import _ from 'lodash'
import * as BMS from 'bms'
import invariant from 'invariant'
import {
  NotechartInput,
  PlayerOptions,
  GameEvent,
  GameNote,
  SoundedEvent,
  NoteInfo,
  NotechartImages,
} from './types'

/**
 * A notechart holds every info about a single player's note chart that the
 * game will ever need.
 */
export class Notechart {
  private _timing: BMS.Timing
  private _keysounds: BMS.Keysounds
  private _positioning: BMS.Positioning
  private _spacing: BMS.Spacing

  private _duration: number
  private _notes: GameNote[]
  private _autos: SoundedEvent[]
  private _barLines: GameEvent[]
  private _samples: string[]
  private _infos: Map<GameNote, NoteInfo>
  private _songInfo: BMS.SongInfo
  private _images: NotechartImages | undefined

  expertJudgmentWindow: [number, number]

  constructor(
    data: NotechartInput,
    playerOptions: Partial<PlayerOptions> = {}
  ) {
    let {
      notes: bmsNotes,
      timing,
      keysounds,
      songInfo,
      positioning,
      spacing,
      barLines,
      images,
      expertJudgmentWindow,
    } = data

    invariant(bmsNotes, 'Expected "data.notes"')
    invariant(timing, 'Expected "data.timing"')
    invariant(keysounds, 'Expected "data.keysounds"')
    invariant(songInfo, 'Expected "data.songInfo"')
    invariant(positioning, 'Expected "data.positioning"')
    invariant(spacing, 'Expected "data.spacing"')
    invariant(barLines, 'Expected "data.barLines"')

    this.expertJudgmentWindow = expertJudgmentWindow

    bmsNotes = this._preTransform(bmsNotes, playerOptions)

    this._timing = timing
    this._positioning = positioning
    this._spacing = spacing
    this._keysounds = keysounds
    this._duration = 0
    this._notes = this._generatePlayableNotesFromBMS(bmsNotes)
    this._autos = this._generateAutoKeysoundEventsFromBMS(bmsNotes)
    this._barLines = this._generateBarLineEvents(barLines)
    this._samples = this._generateKeysoundFiles(keysounds)
    this._infos = new Map<GameNote, NoteInfo>(
      this._notes.map(
        note => [note, this._getNoteInfo(note)] as [GameNote, NoteInfo]
      )
    )
    this._songInfo = songInfo
    this._images = images
  }

  /**
   * An Array of note events.
   */
  get notes() {
    return this._notes
  }

  /**
   * An Array of auto-keysound events.
   */
  get autos() {
    return this._autos
  }

  /**
   * An Array of all the sample files to use.
   */
  get samples() {
    return this._samples
  }

  /**
   * An Object containing the mapping from keysound ID to keysound filename.
   */
  get keysounds() {
    return this._keysounds.all()
  }

  /**
   * An Object representing the bar line events.
   */
  get barLines() {
    return this._barLines
  }

  /**
   * An Array of all column names in this notechart.
   */
  get columns() {
    return ['SC', '1', '2', '3', '4', '5', '6', '7']
  }

  /**
   * Notechart's duration (time of last event)
   */
  get duration() {
    return this._duration
  }

  /**
   * Notechart's song info
   */
  get songInfo() {
    return this._songInfo
  }

  /**
   * Eyecatch image
   */
  get eyecatchImage() {
    return (this._images && this._images.eyecatch) || 'eyecatch_image.png'
  }

  /**
   * Background image
   */
  get backgroundImage() {
    return (this._images && this._images.background) || 'back_image.png'
  }

  /**
   * Returns the characteristic of the note as an Object.
   */
  info(note: GameNote): NoteInfo | undefined {
    return this._infos.get(note)
  }

  /**
   * Converts the beat number to in-song position (seconds)
   */
  beatToSeconds(beat: number) {
    return this._timing.beatToSeconds(beat)
  }

  /**
   * Converts the beat number to in-game position.
   */
  beatToPosition(beat: number) {
    return this._positioning.position(beat)
  }

  /**
   * Converts the in-song position to beat number.
   */
  secondsToBeat(seconds: number) {
    return this._timing.secondsToBeat(seconds)
  }

  /**
   * Converts the in-song position to in-game position.
   */
  secondsToPosition(seconds: number) {
    return this.beatToPosition(this.secondsToBeat(seconds))
  }

  /**
   * Finds BPM at the specified beat.
   */
  bpmAtBeat(beat: number) {
    return this._timing.bpmAtBeat(beat)
  }

  /**
   * Finds the scrolling speed at the specified beat.
   */
  scrollSpeedAtBeat(beat: any) {
    return this._positioning.speed(beat)
  }

  /**
   * Calculates the note spacing factor at the specified beat.
   */
  spacingAtBeat(beat: any) {
    return this._spacing.factor(beat)
  }

  /**
   * Gets the keyMode from scratch
   * @param scratch
   * @returns {string}
   */
  getKeyMode(scratch: string): string {
    const usedColumns: { [column: string]: boolean } = {}
    for (const note of this.notes) {
      usedColumns[note.column] = true
    }
    if (scratch === 'off' && !usedColumns['1'] && !usedColumns['7']) return '5K'
    if (scratch === 'left' && !usedColumns['6'] && !usedColumns['7'])
      return '5K'
    if (scratch === 'right' && !usedColumns['1'] && !usedColumns['2'])
      return '5K'
    return '7K'
  }

  _preTransform(
    bmsNotes: BMS.BMSNote[],
    playerOptions: Partial<PlayerOptions>
  ) {
    let chain = _.chain(bmsNotes)
    let keys = getKeys(bmsNotes)
    if (playerOptions.scratch === 'off') {
      chain = chain.map((note: BMS.BMSNote) => {
        if (note.column && note.column === 'SC') {
          return Object.assign({}, note, { column: null })
        } else {
          return note
        }
      })
    }
    if (keys === '5K') {
      const columnsToShift = ['1', '2', '3', '4', '5', '6', '7']
      const shiftNote = (amount: number) => (note: BMS.BMSNote) => {
        if (note.column) {
          let index = columnsToShift.indexOf(note.column)
          if (index > -1) {
            let newIndex = index + amount
            invariant(
              newIndex < columnsToShift.length,
              'Weird. Columns must not shift beyond available column'
            )
            let newColumn = columnsToShift[newIndex]
            return Object.assign({}, note, { column: newColumn })
          }
        }
        return note
      }
      if (playerOptions.scratch === 'off') {
        chain = chain.map(shiftNote(1))
      } else if (playerOptions.scratch === 'right') {
        chain = chain.map(shiftNote(2))
      }
    }
    return chain.value()
  }

  _generatePlayableNotesFromBMS(bmsNotes: BMS.BMSNote[]) {
    let nextId = 1
    return bmsNotes
      .filter(note => note.column)
      .map(note => {
        let spec = this._generateEvent(note.beat) as GameNote
        spec.id = nextId++
        spec.column = note.column!
        spec.keysound = note.keysound
        spec.keysoundStart = note.keysoundStart
        spec.keysoundEnd = note.keysoundEnd
        this._updateDuration(spec)
        if (note.endBeat !== undefined) {
          spec.end = this._generateEvent(note.endBeat)
          this._updateDuration(spec.end)
        } else {
          spec.end = undefined
        }
        return spec
      })
  }

  _updateDuration(event: GameEvent) {
    if (event.time > this._duration) this._duration = event.time
  }

  _generateAutoKeysoundEventsFromBMS(bmsNotes: BMS.BMSNote[]) {
    return bmsNotes
      .filter(note => !note.column)
      .map(note => {
        let spec = this._generateEvent(note.beat) as SoundedEvent
        spec.keysound = note.keysound
        spec.keysoundStart = note.keysoundStart
        spec.keysoundEnd = note.keysoundEnd
        return spec
      })
  }

  _generateKeysoundFiles(keysounds: BMS.Keysounds): string[] {
    let set = new Set<string>()
    for (let array of [this.notes, this.autos]) {
      for (let event_ of array) {
        let file = keysounds.get(event_.keysound)
        if (file) set.add(file)
      }
    }
    return Array.from(set)
  }

  _generateBarLineEvents(beats: number[]) {
    return beats.map(beat => this._generateEvent(beat))
  }

  _generateEvent(beat: number): GameEvent {
    return {
      beat: beat,
      time: this.beatToSeconds(beat),
      position: this.beatToPosition(beat),
    }
  }

  _getNoteInfo(note: GameNote): NoteInfo {
    return { combos: note.end ? 2 : 1 }
  }
}

export default Notechart

function getKeys(bmsNotes: BMS.BMSNote[]) {
  for (let note of bmsNotes) {
    if (note.column === '6' || note.column === '7') {
      return '7K'
    }
  }
  return '5K'
}
