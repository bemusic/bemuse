import {
  IJudge,
  JudgedJudgment,
  Judgment,
  MISSED,
  getJudgeForNotechart,
  isBad,
  judgeEndTime,
  judgeTime,
} from '../judgments'

import Control from '../input/control'
import GameInput from '../input'
import { GameNote } from 'bemuse-notechart/lib/types'
import Player from '../player'
import PlayerStats from './player-stats'
import _ from 'lodash'
import invariant from 'invariant'

type NoteResult = {
  judgment: Judgment
  status: NoteStatus
  delta: number
}

enum NoteStatus {
  /** For long notes -- when the player is holding the note but not yet release it. */
  Active = 'active',
  /** This not is not yet judged. */
  Unjudged = 'unjudged',
  /** This note is fully-judged. */
  Judged = 'judged',
}

export type SoundNotification =
  | {
      type: 'hit'
      note: GameNote
      judgment: Judgment
    }
  | {
      type: 'free'
      note: GameNote
    }
  | {
      type: 'break'
      note: GameNote
    }

export interface JudgementNotification {
  judgment: JudgedJudgment
  combo: number
  delta: number
  column: string
}

export interface Notifications {
  sounds: SoundNotification[]
  judgments: JudgementNotification[]
}

function initializeNotifications(): Notifications {
  return { sounds: [], judgments: [] }
}

// The PlayerState class holds a single player's state, including the stats
// (score, current combo, maximum combo).
export class PlayerState {
  /** The PlayerStats object. */
  public stats: PlayerStats

  /** The notifications from the previous update. */
  public notifications = initializeNotifications()
  /** The current note scrolling speed. */
  public speed: number
  /** `true` if finished playing, `false` otherwise. */
  public finished = false
  /** `true` if score is invalid due to autoplay being activated. `false` otherwise. */
  public tainted = false
  public input: Map<string, Control> = new Map()

  private _columns: string[]
  private _noteBufferByColumn: _.Dictionary<NoteBuffer>
  private _noteResult: Map<GameNote, NoteResult>
  private _duration: number
  private _judge: IJudge
  private _gameTime = 0
  private _rawInput?: GameInput
  private _pinching: null | { start: number; speed: number } = null

  constructor(public readonly player: Player) {
    this._columns = player.columns
    this._noteBufferByColumn = _(player.notechart.notes)
      .sortBy((n) => n.time)
      .groupBy((n) => n.column)
      .mapValues(noteBuffer(this))
      .value()
    this._noteResult = new Map()
    this._duration = player.notechart.duration
    this._judge = getJudgeForNotechart(player.notechart, {
      tutorial: player.options.tutorial,
    })
    this.stats = new PlayerStats(player.notechart)
    this.speed = player.options.speed
  }

  /**
   * Updates the state. Judge the notes and emit notifications.
   */
  update(gameTime: number, input: GameInput) {
    this._gameTime = gameTime
    this._rawInput = input
    this.notifications = initializeNotifications()
    this._updateInputColumnMap()
    this._judgeNotes()
    this._updateSpeed()
    if (gameTime > this._duration + 3) this.finished = true
  }

  getNoteStatus(note: GameNote): NoteStatus {
    const result = this._noteResult.get(note)
    if (!result) return NoteStatus.Unjudged
    return result.status
  }

  getNoteJudgment(note: GameNote) {
    const result = this._noteResult.get(note)
    if (!result) return Judgment.Unjudged
    return result.judgment
  }

  getPlayerInput(control: string) {
    return this._rawInput!.get(`p${this.player.number}_${control}`)!
  }

  _updateInputColumnMap() {
    this.input = new Map(
      this._columns.map((column) => [column, this.getPlayerInput(column)])
    )
  }

  _judgeNotes() {
    for (const column of this._columns) {
      const buffer = this._noteBufferByColumn[column]
      if (buffer) {
        const control = this.input.get(column)!
        this._judgeColumn(buffer, control, column)
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
    const pinch = this.getPlayerInput('pinch').value
    if (pinch && !this._pinching) {
      this._pinching = { start: pinch, speed: this.speed }
    } else if (!pinch) {
      this._pinching = null
    }
    if (pinch && this._pinching) {
      const pinching = this._pinching
      const speed = (pinching.speed * pinch) / pinching.start
      this.speed = Math.max(0.2, Math.round(speed * 10) / 10)
    }
  }

  _modifySpeed(direction: 1 | -1) {
    const amount = this._rawInput!.get('select').value
      ? 0.1
      : this.speed < 0.5
      ? 0.3
      : 0.5
    this.speed += direction * amount
    if (this.speed < 0.2) this.speed = 0.2
  }

  _shouldAutoplay() {
    return this.player.options.autoplayEnabled || isAutoplayEnabled()
  }

  _judgeColumn(buffer: NoteBuffer, control: Control, column: string) {
    let judgedNote
    let judgment
    const notes = buffer.notes
    let autoPlayed = false
    for (let i = buffer.startIndex; i < notes.length; i++) {
      const note = notes[i]
      if (this._shouldJudge(note, control, buffer)) {
        const shouldBreak = this.getNoteStatus(note) !== 'active'
        judgedNote = note
        judgment = this._judgeNote(note)
        if (this._shouldAutoplay()) {
          autoPlayed = true
        }
        if (shouldBreak) break
      }
    }
    if (control.justPressed || autoPlayed) {
      if (judgedNote && judgment != null) {
        this.notifications.sounds!.push({
          note: judgedNote,
          type: 'hit',
          judgment: judgment,
        })
      } else {
        const freestyleNote = this._getFreestyleNote(notes)
        if (freestyleNote) {
          const shouldPlayFreestyleNote =
            this.player.options.placement !== '3d' ||
            !this._isSandwiched(column)
          if (shouldPlayFreestyleNote) {
            this.notifications.sounds!.push({
              note: freestyleNote,
              type: 'free',
            })
          }
        }
      }
    }
  }

  _getClosestNote(notes: GameNote[]) {
    return _.minBy(notes, (note) => Math.abs(this._gameTime - note.time))
  }

  _getFreestyleNote(notes: GameNote[]) {
    return _.minBy(notes, (note) => {
      const distance = Math.abs(this._gameTime - note.time)
      const penalty = this._gameTime < note.time - 1 ? 1000000 : 0
      return distance + penalty
    })
  }

  _isSandwiched(column: string) {
    const mapping: { [col: string]: string[] } = {
      '2': ['1', '3'],
      '3': ['2', '4'],
      '4': ['3', '5'],
      '5': ['4', '6'],
      '6': ['5', '7'],
    }
    if (!mapping[column]) return false
    return mapping[column].every((adjacentColumn) => {
      const buffer = this._noteBufferByColumn[adjacentColumn]
      if (!buffer) return false
      return buffer.notes.some(
        (note) => Math.abs(this._gameTime - note.time) < 0.1
      )
    })
  }

  _shouldJudge(note: GameNote, control: Control, buffer: NoteBuffer) {
    const status = this.getNoteStatus(note)
    if (status === 'unjudged') {
      if (this._shouldAutoplay() && this._gameTime >= note.time) {
        this.tainted = true
        return true
      }
      const judgment = judgeTime(this._gameTime, note.time, this._judge)
      const missed = judgment === MISSED
      let hit = judgment > 0 && control.changed && control.value
      if (isBad(judgment) && this._getClosestNote(buffer.notes) !== note) {
        hit = false
      }
      return missed || hit
    } else if (status === 'active') {
      const noteEnd = note.end || invariant(false, 'note.end must exist')
      if (this._shouldAutoplay() && this._gameTime >= noteEnd.time) {
        this.tainted = true
        return true
      }
      const judgment = judgeEndTime(this._gameTime, noteEnd.time, this._judge)
      const missed = judgment === MISSED
      const lifted = control.changed
      const scratch = note.column === 'SC'
      const passed = this._gameTime >= noteEnd.time
      return missed || lifted || (scratch && passed)
    } else {
      return false
    }
  }

  _judgeNote(note: GameNote) {
    let delta = this._gameTime - note.time
    let judgment = judgeTime(this._gameTime, note.time, this._judge)
    let result = this._noteResult.get(note)
    const isDown = !result || result.status === 'unjudged'
    const isUp = result && result.status === 'active'
    if (this._shouldAutoplay() && judgment >= 1) {
      judgment = 1
    }
    if (note.end) {
      if (isDown) {
        const status =
          judgment === MISSED ? NoteStatus.Judged : NoteStatus.Active
        if (judgment === MISSED) {
          // judge missed long note twice
          this._setJudgment(judgment, delta, note.column)
        }
        result = { status, judgment, delta }
      } else if (isUp) {
        const scratch = note.column === 'SC'
        delta = this._gameTime - note.end.time
        judgment =
          judgeEndTime(this._gameTime, note.end.time, this._judge) || MISSED
        if (scratch && delta > 0) judgment = 1
        result = { status: NoteStatus.Judged, judgment, delta }
      }
    } else {
      result = { status: NoteStatus.Judged, judgment, delta }
    }
    if (judgment === MISSED) {
      this.notifications.sounds.push({ note, type: 'break' })
    }
    if (isDown && judgment !== MISSED) {
      this.stats.handleDelta(delta)
    }
    if (!result) {
      throw new Error('Invariant violation: result must not be undefined')
    }
    if (!judgment) {
      throw new Error(
        'Invariant violation: note should be judged by this point'
      )
    }
    this._noteResult.set(note, result)
    this._setJudgment(judgment, delta, note.column)
    return judgment
  }

  _setJudgment(judgment: JudgedJudgment, delta: number, column: string) {
    this.stats.handleJudgment(judgment)
    const info = { judgment, combo: this.stats.combo, delta, column }
    this.notifications.judgments.push(info)
  }
}

type NoteBuffer = {
  notes: GameNote[]
  startIndex: number
  update: () => void
}

function isAutoplayEnabled() {
  return !!(window as any).BEMUSE_AUTOPLAY
}

function noteBuffer(state: PlayerState) {
  return function bufferNotes(notes: GameNote[]): NoteBuffer {
    let startIndex = 0
    return {
      notes,
      get startIndex() {
        return startIndex
      },
      update() {
        while (
          startIndex < notes.length &&
          state.getNoteStatus(notes[startIndex]) === 'judged'
        ) {
          startIndex += 1
        }
      },
    }
  }
}

export default PlayerState
