
import R from 'ramda'

export class PlayerState {
  constructor(player) {
    this._player       = player
    this._notes        = R.sortBy(R.prop('time'), player.notechart.notes)
    this._noteResult   = new Map()
  }
  update(gameTime, input) {
    let prefix = `p${this._player.number}_`
    this._gameTime = gameTime
    this.input = new Map(this._player.columns.map((column) =>
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
    for (let i = 0; i < this._notes.length; i ++) {
      let note = this._notes[i]
      if (this._shouldJudge(note)) {
        this._judge(note)
        break
      }
    }
  }
  _shouldJudge(note) {
    if (this.getNoteStatus(note) !== 'unjudged') return false
    let judgment  = judgeTime(this._gameTime, note.time)
    let missed    = judgment === -1
    let control   = this.input.get(note.column)
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
