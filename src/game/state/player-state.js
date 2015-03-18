
import R from 'ramda'

export class PlayerState {
  constructor(player) {
    this._player        = player
    this._columns       = player.columns
    this._notesByColumn = R.groupBy(R.prop('column'),
        R.sortBy(R.prop('time'), player.notechart.notes))
    this._noteResult    = new Map()
  }
  update(gameTime, input) {
    let prefix = `p${this._player.number}_`
    this._gameTime = gameTime
    this.input = new Map(this._columns.map((column) =>
        [column, input.get(`${prefix}${column}`)]))
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
    this._noteResult.set(note, {
      status: 'judged', judgment: judgeTime(this._gameTime, note.time),
    })
  }
}

/**
 * Takes a gameTime and noteTime and returns the appropriate judgment.
 *
 *  1 - METICULOUS
 *  2 - PRECISE
 *  3 - GOOD
 *  4 - OFFBEAT
 *  0 - (not judge)
 * -1 - MISSED
 */
export function judgeTime(gameTime, noteTime) {
  let delta = Math.abs(gameTime - noteTime)
  if (delta < 0.018) return 1
  if (delta < 0.040) return 2
  if (delta < 0.100) return 3
  if (delta < 0.200) return 4
  if (gameTime < noteTime) return 0
  return -1
}

export default PlayerState
