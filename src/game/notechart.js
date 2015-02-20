
import BMS from 'bms'

import GameEvent  from './data/event'
import GameNote   from './data/game-note'

// A notechart holds every info about a single player's note chart that the
// game will ever need.
//
export class Notechart {
  constructor(bmsNotes, timing, playerNumber, playerOptions) {
    this._timing  = timing
    this._notes   = this._generatePlayableNotesFromBMS(bmsNotes)
    this._autos   = this._generateAutoKeysoundEventsFromBMS(bmsNotes)
    void playerNumber
    void playerOptions
  }
  get notes() {
    return this._notes
  }
  get autos() {
    return this._autos
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
  _generateEvent(beat) {
    return {
      beat:     beat,
      time:     this.beatToSeconds(beat),
      position: this.beatToPosition(beat),
    }
  }
  static fromBMSChart(chart, playerNumber, playerOptions) {
    let notes     = BMS.Notes.fromBMSChart(chart)
    let timing    = BMS.Timing.fromBMSChart(chart)
    return new Notechart(notes, timing, playerNumber, playerOptions)
  }
}

export default Notechart
