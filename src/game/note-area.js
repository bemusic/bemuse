
import R from 'ramda'

export class NoteArea {
  constructor(notes) {
    this._notes = R.sortBy(position, notes)
  }
  getVisibleNotes(lower, upper, height) {
    return this._notes.filter(note =>
      note.end ?
        !(note.position > upper || note.end.position < lower) :
        !(note.position > upper || note.position < lower))
    .map(note => {
      if (!note.end) {
        return {  key: note.id, y: y(lower, upper, note.position, height),
                  column: note.column, }
      } else {
        let head = y(lower, upper, note.position, height)
        let tail = y(lower, upper, note.end.position, height)
        return {  key: note.id, y: Math.min(head, tail),
                  height: Math.abs(head - tail),
                  column: note.column, }
      }
    })
  }
}

export default NoteArea

function y(lower, upper, position, height) {
  return height - (position - lower) / (upper - lower) * height
}

function position(event) {
  return event.position
}
