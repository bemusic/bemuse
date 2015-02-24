
import R from 'ramda'

export class NoteArea {
  constructor(notes) {
    this._notes = R.sortBy(position, notes)
  }
  getVisibleNotes(lower, upper) {
    let out = []
    let notes = this._notes
    for (let i = 0; i < notes.length; i ++) {
      let note = notes[i]
      let visible = note.end ?
            !(note.position > upper || note.end.position < lower) :
            !(note.position > upper || note.position < lower)
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
}

export default NoteArea

function y(lower, upper, position) {
  return 1 - (position - lower) / (upper - lower)
}

function position(event) {
  return event.position
}
