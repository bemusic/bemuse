
import NoteArea from './note-area'

export class PlayerDisplay {
  constructor(player) {
    this._player    = player
    this._noteArea  = new NoteArea(player.notechart.notes)
  }
  update(time, gameTime, playerState) {
    let player   = this._player
    let noteArea = this._noteArea
    let position = player.notechart.secondsToPosition(gameTime)
    let data     = { }
    let push     = (key, value) => (data[key] || (data[key] = [])).push(value)
    updateVisibleNotes()
    updateInput()
    return data

    function updateVisibleNotes() {
      let entities = noteArea.getVisibleNotes(position, position + (5 / 3))
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
    }

    function updateInput() {
      let input = playerState.input
      for (let column of player.columns) {
        let control = input.get(column)
        data[`${column}_active`] = (control.value !== 0) ? 1 : 0
        if (control.changed) {
          if (control.value !== 0) {
            data[`${column}_down`] = time
          } else {
            data[`${column}_up`] = time
          }
        }
      }
    }

  }
}

export default PlayerDisplay
