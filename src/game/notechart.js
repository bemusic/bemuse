
import BMS from 'bms'

import GameEvent  from './data/event'
import GameNote   from './data/game-note'

// A notechart holds every info about a single player's note chart that the
// game will ever need.
//
export class Notechart {
  constructor(bms, playerNumber, playerOptions) {
    let bmsNotes    = BMS.Notes.fromBMSChart(bms)
    let timing      = BMS.Timing.fromBMSChart(bms)
    let keysounds   = BMS.Keysounds.fromBMSChart(bms)
    this._timing    = timing
    this._notes     = this._generatePlayableNotesFromBMS(bmsNotes)
    this._autos     = this._generateAutoKeysoundEventsFromBMS(bmsNotes)
    this._samples   = this._generateKeysoundFiles(keysounds)
    this.keysounds  = keysounds.all()
    void playerNumber
    void playerOptions
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
  static fromBMSChart(chart, playerNumber, playerOptions) {
    return new Notechart(chart, playerNumber, playerOptions)
  }
}

export default Notechart
