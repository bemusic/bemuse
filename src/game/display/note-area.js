
import _ from 'lodash'

export class NoteArea {
  constructor(notes, barLines) {
    this._notes     = _.sortBy(notes, position)
    this._barLines  = _(barLines).pluck('position').sortBy().value()
  }
  getVisibleNotes(lower, upper, headroom) {
    let out = []
    let notes = this._notes
    if (!headroom) headroom = 0
    for (let i = 0; i < notes.length; i ++) {
      let note = notes[i]
      let visible = note.end ?
            !(note.position > upper || note.end.position < lower - headroom) :
            !(note.position > upper || note.position < lower - headroom)
      if (visible) {
        let entity = { note: note }
        if (!note.end) {
          entity.y = y(lower, upper, note.position)
        } else {
          let head = y(lower, upper, note.position)
          let tail = y(lower, upper, note.end.position)
          entity.y       = Math.min(head, tail)
          entity.height  = Math.abs(head - tail)
        }
        out.push(entity)
      }
    }
    return out
  }
  getVisibleBarLines(lower, upper, headroom) {
    if (!headroom) headroom = 0
    return this._barLines
        .filter(pos => (lower - headroom <= pos && pos <= upper))
        .map(pos => ({ id: pos, y: y(lower, upper, pos) }))
  }
}

export default NoteArea

function y(lower, upper, position) {
  return 1 - (position - lower) / (upper - lower)
}

function position(event) {
  return event.position
}
