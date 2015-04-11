
import R from 'ramda'
import { judgeTime, judgeEndTime, isBad, MISSED } from '../judgments'
import PlayerStats   from './player-stats'

// The PlayerState class holds a single player's state, including the stats
// (score, current combo, maximum combo).
export class PlayerState {
  constructor(player) {
    this._player        = player
    this._columns       = player.columns
    this._noteBufferByColumn = R.mapObj(noteBuffer(this))(
        R.groupBy(R.prop('column'))(
          R.sortBy(R.prop('time'), player.notechart.notes)))
    this._noteResult    = new Map()

    // The PlayerStats object.
    this.stats          = new PlayerStats(player.notechart)

    // The notifications from the previous update.
    this.notifications  = { }

    // The current note scrolling speed.
    this.speed          = player.options.speed
  }

  // Updates the state. Judge the notes and emit notifications.
  update(gameTime, input) {
    this._gameTime = gameTime
    this._rawInput = input
    this.notifications = { }
    this.notifications.sounds     = [ ]
    this.notifications.judgments  = [ ]
    this._updateInputColumnMap()
    this._judgeNotes()
    this._updateSpeed()
  }

  // Returns the status of the note as a string. The results may be:
  //
  // unjudged
  //   This note is unjudged.
  // active
  //   For long notes -- when the player is holding the note
  //   but not yet release it.
  // judged
  //   This note is fully-judged.
  getNoteStatus(note) {
    let result = this._noteResult.get(note)
    if (!result) return 'unjudged'
    return result.status
  }

  // Returns the Number representing judgment of the note.
  // The judgment may be:
  //
  // 0
  //   When the note is unjudged.
  // otherwise
  //   See the game/judgments module for information about this number.
  getNoteJudgment(note) {
    let result = this._noteResult.get(note)
    if (!result) return 0
    return result.judgment
  }

  getPlayerInput(control) {
    return this._rawInput.get(`p${this._player.number}_${control}`)
  }
  _updateInputColumnMap() {
    this.input = new Map(this._columns.map((column) =>
        [column, this.getPlayerInput(column)]))
  }

  _judgeNotes() {
    for (let column of this._columns) {
      let buffer = this._noteBufferByColumn[column]
      if (buffer) {
        let control = this.input.get(column)
        this._judgeColumn(buffer, control)
        buffer.update()
      }
    }
  }
  _updateSpeed() {
    if (this.getPlayerInput('speedup').justPressed) {
      this._modifySpeed(+1)
    }
    if (this.getPlayerInput('speeddown').justPressed) {
      this._modifySpeed(-1)
    }
  }
  _modifySpeed(direction) {
    let amount = this._rawInput.get('select').value ? 0.1 : 0.5
    this.speed += direction * amount
  }

  _judgeColumn(buffer, control) {
    let judgedNote
    let judgment
    let notes = buffer.notes
    for (let i = buffer.startIndex; i < notes.length; i ++) {
      let note = notes[i]
      if (this._shouldJudge(note, control, buffer)) {
        judgedNote = note
        judgment = this._judge(note)
        break
      }
    }
    if (control.justPressed) {
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
  _shouldJudge(note, control, buffer) {
    let status = this.getNoteStatus(note)
    if (status === 'unjudged') {
      let judgment  = judgeTime(this._gameTime, note.time)
      let missed    = judgment === MISSED
      let hit       = judgment > 0 && control.changed && control.value
      if (isBad(judgment) && this._getClosestNote(buffer.notes) !== note) {
        hit = false
      }
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
    if (judgment === MISSED) {
      this.notifications.sounds.push({ note, type: 'break' })
    }
    this._noteResult.set(note, result)
    this._setJudgment(judgment, delta, note.column)
    return judgment
  }
  _setJudgment(judgment, delta, column) {
    this.stats.handleJudgment(judgment)
    let info = { judgment, combo: this.stats.combo, delta, column }
    this.notifications.judgments.push(info)
  }
}

function noteBuffer(state) {
  return function bufferNotes(notes) {
    let startIndex  = 0
    return {
      notes,
      get startIndex() {
        return startIndex
      },
      update() {
        while (startIndex < notes.length &&
            state.getNoteStatus(notes[startIndex]) === 'judged') {
          startIndex += 1
        }
      },
    }
  }
}

export default PlayerState
