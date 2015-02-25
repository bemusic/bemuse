
import NoteArea from './note-area'

export class PlayerDisplay {
  constructor(player) {
    this._player    = player
    this._noteArea  = new NoteArea(player.notechart.notes)
  }
  update(time, gameTime) {
    let position = this._player.notechart.secondsToPosition(gameTime)
    let data     = { }
    let entities = this._noteArea.getVisibleNotes(position, position + (5 / 3))
    let push     = (key, value) => (data[key] || (data[key] = [])).push(value)
    for (let entity of entities) {
      let note    = entity.note
      let column  = note.column
      if (entity.height) {
        push(`longnote_${column}`, {
          key:    note.id,
          y:      entity.y,
          height: entity.height,
          active: entity.y + entity.height > 1,
          missed: false,
        })
      } else {
        push(`note_${column}`, {
          key:    note.id,
          y:      entity.y,
        })
      }
    }
    return data
  }
}

export default PlayerDisplay
