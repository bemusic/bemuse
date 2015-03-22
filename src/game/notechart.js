
import BMS from 'bms'

import R          from 'ramda'
import GameEvent  from './data/event'
import GameNote   from './data/game-note'

// A notechart holds every info about a single player's note chart that the
// game will ever need.
//
export class Notechart {
  constructor(bms) {
    let bmsNotes    = BMS.Notes.fromBMSChart(bms)
    let timing      = BMS.Timing.fromBMSChart(bms)
    let keysounds   = BMS.Keysounds.fromBMSChart(bms)
    this._timing    = timing
    this._keysounds = keysounds
    this._notes     = this._generatePlayableNotesFromBMS(bmsNotes)
    this._autos     = this._generateAutoKeysoundEventsFromBMS(bmsNotes)
    this._barLines  = this._generateBarLines(bmsNotes, bms)
    this._samples   = this._generateKeysoundFiles(keysounds)
    this._infos     = new Map(this._notes.map(
        note => [note, this._getNoteInfo(note)]))
  }
  get notes() {
    return this._notes
  }
  get autos() {
    return this._autos
  }
  get samples() {
    return this._samples
  }
  get keysounds() {
    return this._keysounds.all()
  }
  get barLines() {
    return this._barLines
  }
  get columns() {
    return ['SC', '1', '2', '3', '4', '5', '6', '7']
  }

  /**
   * Returns the characteristic of the note.
   */
  info(note) {
    return this._infos.get(note)
  }

  beatToSeconds(beat) {
    return this._timing.beatToSeconds(beat)
  }
  beatToPosition(beat) {
    return beat
  }
  secondsToBeat(seconds) {
    return this._timing.secondsToBeat(seconds)
  }
  secondsToPosition(seconds) {
    return this.beatToPosition(this.secondsToBeat(seconds))
  }
  _generatePlayableNotesFromBMS(bmsNotes) {
    let nextId = 1
    return bmsNotes.all()
    .filter(note => note.column)
    .map(note => {
      let spec = this._generateEvent(note.beat)
      spec.id       = nextId++
      spec.column   = note.column.column
      spec.keysound = note.keysound
      if (note.endBeat !== undefined) {
        spec.end = this._generateEvent(note.endBeat)
      } else {
        spec.end = undefined
      }
      return new GameNote(spec)
    })
  }
  _generateAutoKeysoundEventsFromBMS(bmsNotes) {
    return bmsNotes.all()
    .filter(note => !note.column)
    .map(note => {
      let spec = this._generateEvent(note.beat)
      spec.keysound = note.keysound
      return new GameEvent(spec)
    })
  }
  _generateBarLines(bmsNotes, bms) {
    let max = R.max(bmsNotes.all().map(note => note.endBeat || note.beat))
    let barLines = [ { beat: 0, position: 0 } ]
    let currentBeat     = 0
    let currentMeasure  = 0
    let currentPosition = 0
    do {
      currentBeat += bms.timeSignatures.getBeats(currentMeasure)
      currentMeasure += 1
      currentPosition = this.beatToPosition(currentBeat)
      barLines.push({ beat: currentBeat, position: currentPosition })
    } while (currentBeat <= max)
    return barLines
  }
  _generateKeysoundFiles(keysounds) {
    let set = new Set()
    for (let array of [this.notes, this.autos]) {
      for (let event_ of array) {
        let file = keysounds.get(event_.keysound)
        if (file) set.add(file)
      }
    }
    return Array.from(set)
  }
  _generateEvent(beat) {
    return {
      beat:     beat,
      time:     this.beatToSeconds(beat),
      position: this.beatToPosition(beat),
    }
  }
  _getNoteInfo(note) {
    let combos = note.end ? 2 : 1
    return { combos }
  }
  static fromBMSChart(chart, playerNumber, playerOptions) {
    return new Notechart(chart, playerNumber, playerOptions)
  }
}

export default Notechart
