
import NoteArea from './note-area'
import { MISSED } from '../judgments'

export class PlayerDisplay {
  constructor(player) {
    this._player    = player
    this._noteArea  = new NoteArea(player.notechart.notes)
    this._stateful  = { }
  }
  update(time, gameTime, playerState) {
    let player   = this._player
    let noteArea = this._noteArea
    let stateful = this._stateful
    let position = player.notechart.secondsToPosition(gameTime)
    let data     = { }
    let push     = (key, value) => (data[key] || (data[key] = [])).push(value)
    updateVisibleNotes()
    updateInput()
    updateJudgment()
    Object.assign(data, stateful)
    return data

    function updateVisibleNotes() {
      let entities = noteArea.getVisibleNotes(position, position + (5 / 3))
      for (let entity of entities) {
        let note    = entity.note
        let column  = note.column
        if (entity.height) {
          let judgment = playerState.getNoteJudgment(note)
          push(`longnote_${column}`, {
            key:    note.id,
            y:      entity.y,
            height: entity.height,
            active: judgment > 0,
            missed: judgment === MISSED,
          })
        } else {
          if (playerState.getNoteStatus(note) !== 'judged') {
            push(`note_${column}`, {
              key:    note.id,
              y:      entity.y,
            })
          }
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
            stateful[`${column}_down`] = time
          } else {
            stateful[`${column}_up`] = time
          }
        }
      }
    }

    function updateJudgment() {
      let notification = playerState.notifications.judgment
      if (notification) {
        let name = notification.judgment === -1 ? 'missed' :
              `${notification.judgment}`
        stateful[`judge_${name}`] = time
        stateful[`combo`] = notification.combo
      }
    }

  }
}

export default PlayerDisplay
