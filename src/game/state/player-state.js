
import R from 'ramda'
import { judgeTime, judgeEndTime, breaksCombo, MISSED } from '../judgments'
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
    this.notifications.sounds = [ ]
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
    let judgedNote
    let judgment
    for (let i = 0; i < notes.length; i ++) {
      let note = notes[i]
      if (this._shouldJudge(note, control)) {
        judgedNote = note
        judgment = this._judge(note)
        break
      }
    }
    let justPressed = control.changed && control.value
    if (justPressed) {
      if (judgedNote) {
        this.notifications.sounds.push({
          note: judgedNote,
          type: 'hit',
          judgment: judgment,
        })
      } else {
        let closestNote = this._getClosestNote(notes)
        if (closestNote) {
          this.notifications.sounds.push({ note: closestNote, type: 'free' })
        }
      }
    }
  }
  _getClosestNote(notes) {
    return R.minBy(note => Math.abs(this._gameTime - note.time), notes)
  }
  _shouldJudge(note, control) {
    let status = this.getNoteStatus(note)
    if (status === 'unjudged') {
      let judgment  = judgeTime(this._gameTime, note.time)
      let missed    = judgment === MISSED
      let hit       = judgment > 0 && control.changed && control.value
      return missed || hit
    } else if (status === 'active') {
      let judgment  = judgeEndTime(this._gameTime, note.end.time)
      let missed    = judgment === MISSED
      let lifted    = !control.value
      return missed || lifted
    } else {
      return false
    }
  }
  _judge(note) {
    let delta    = this._gameTime - note.time
    let judgment = judgeTime(this._gameTime, note.time)
    let result   = this._noteResult.get(note)
    if (note.end) {
      if (!result || result.status === 'unjudged') {
        let status = judgment === MISSED ? 'judged' : 'active'
        result = { status, judgment, delta }
      } else if (result.status === 'active') {
        delta    = this._gameTime - note.end.time
        judgment = judgeEndTime(this._gameTime, note.end.time) || MISSED
        result = { status: 'judged', judgment, delta }
      }
    } else {
      result = { status: 'judged', judgment, delta }
    }
    if (breaksCombo(judgment)) {
      this.notifications.sounds.push({ note, type: 'break' })
    }
    this._noteResult.set(note, result)
    this._setJudgment(judgment, delta)
    return judgment
  }
  _setJudgment(judgment, delta) {
    this.stats.handleJudgment(judgment)
    this.notifications.judgment = { judgment, combo: this.stats.combo, delta }
  }
}


export default PlayerState
