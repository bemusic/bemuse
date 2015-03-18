
import R from 'ramda'
import { judgeTime } from '../judgments'
import PlayerStats   from './player-stats'

export class PlayerState {
  constructor(player) {
    this._player        = player
    this._columns       = player.columns
    this._notesByColumn = R.groupBy(R.prop('column'),
        R.sortBy(R.prop('time'), player.notechart.notes))
    this._noteResult    = new Map()
    this.stats          = new PlayerStats(player.notechart)
    this.notifications  = { }
  }
  update(gameTime, input) {
    this._gameTime = gameTime
    this.notifications = { }
    this.input = this._createInputColumnMap(input)
    this._judgeNotes(gameTime)
  }
  getNoteStatus(note) {
    let result = this._noteResult.get(note)
    if (!result) return 'unjudged'
    return result.status
  }
  getNoteJudgment(note) {
    let result = this._noteResult.get(note)
    if (!result) return 0
    return result.judgment
  }
  _createInputColumnMap(input) {
    let prefix = `p${this._player.number}_`
    return new Map(this._columns.map((column) =>
        [column, input.get(`${prefix}${column}`)]))
  }
  _judgeNotes() {
    for (let column of this._columns) {
      let notes   = this._notesByColumn[column]
      if (notes) {
        let control = this.input.get(column)
        this._judgeColumn(notes, control)
      }
    }
  }
  _judgeColumn(notes, control) {
    for (let i = 0; i < notes.length; i ++) {
      let note = notes[i]
      if (this._shouldJudge(note, control)) {
        this._judge(note)
        break
      }
    }
  }
  _shouldJudge(note, control) {
    if (this.getNoteStatus(note) !== 'unjudged') return false
    let judgment  = judgeTime(this._gameTime, note.time)
    let missed    = judgment === -1
    let hit       = judgment > 0 && control.changed && control.value
    return missed || hit
  }
  _judge(note) {
    let delta = this._gameTime - note.time
    let judgment = judgeTime(this._gameTime, note.time)
    this._noteResult.set(note, { status: 'judged', judgment, delta })
    this.stats.handleJudgment(judgment)
    this.notifications.judgment = { judgment, combo: this.stats.combo, delta }
  }
}


export default PlayerState
