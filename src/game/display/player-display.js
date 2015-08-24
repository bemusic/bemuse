
import NoteArea from './note-area'
import { MISSED, breaksCombo } from '../judgments'

export class PlayerDisplay {
  constructor(player) {
    let notechart = player.notechart
    this._currentSpeed  = 1
    this._player        = player
    this._noteArea      = new NoteArea(notechart.notes, notechart.barLines)
    this._stateful      = { }
    this._defaultData   = {
      placement: player.options.placement,
      scratch:   player.options.scratch,
    }
  }
  update(time, gameTime, playerState) {
    let player   = this._player
    let noteArea = this._noteArea
    let stateful = this._stateful
    let beat     = player.notechart.secondsToBeat(gameTime)
    let position = player.notechart.beatToPosition(beat)
    let spacing  = player.notechart.spacingAtBeat(beat)
    let data     = Object.assign({ }, this._defaultData)
    let push     = (key, value) => (data[key] || (data[key] = [])).push(value)

    this._currentSpeed += (playerState.speed - this._currentSpeed) / 3
    let speed    = this._currentSpeed * spacing

    updateBeat()
    updateVisibleNotes()
    updateBarLines()
    updateInput()
    updateJudgment()
    updateExplode()

    data['speed'] = (playerState.speed.toFixed(1) + 'x')
    data['stat_1'] = getCount(1)
    data['stat_2'] = getCount(2)
    data['stat_3'] = getCount(3)
    data['stat_4'] = getCount(4)
    data['stat_missed'] = getCount(MISSED)
    data['stat_acc'] = getAccuracy()
    data['bpm'] = Math.round(player.notechart.bpmAtBeat(beat))

    Object.assign(data, stateful)
    return data

    function updateBeat() {
      data.beat = beat
    }

    function getCount(judgment) {
      return playerState.stats.counts && playerState.stats.counts[judgment]
    }

    function getAccuracy() {
      return ((playerState.stats.currentAccuracy || 0) * 100).toFixed(2) + '%'
    }

    function updateVisibleNotes() {
      let entities = noteArea.getVisibleNotes(position, getUpperBound(), 1)
      for (let entity of entities) {
        let note    = entity.note
        let column  = note.column
        if (entity.height) {
          let judgment  = playerState.getNoteJudgment(note)
          let status    = playerState.getNoteStatus(note)
          push(`longnote_${column}`, {
            key:    note.id,
            y:      entity.y,
            height: entity.height,
            active: judgment !== 0 && judgment !== MISSED,
            missed: status === 'judged' && judgment === MISSED,
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

    function updateBarLines() {
      let entities = noteArea.getVisibleBarLines(position, getUpperBound(), 1)
      for (let entity of entities) {
        push(`barlines`, { key: entity.id, y: entity.y })
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
      let notifications = playerState.notifications.judgments
      let notification = notifications[notifications.length - 1]
      if (notification) {
        let name = (
          notification.judgment === -1
          ? 'missed'
          : `${notification.judgment}`
        )
        stateful[`judge_${name}`] = time
        let deviationMode = (
          notification.judgment === -1 || notification.judgment === 1
          ? 'none'
          : (notification.delta > 0 ? 'late' : notification.delta < 0 ? 'early' : 'none')
        )
        stateful[`judge_deviation_${deviationMode}`] = time
        stateful[`combo`] = notification.combo
      }
      data[`score`] = playerState.stats.score
    }

    function updateExplode() {
      let notifications = playerState.notifications.judgments
      for (let i = 0; i < notifications.length; i++) {
        let notification = notifications[i]
        if (!breaksCombo(notification.judgment)) {
          stateful[`${notification.column}_explode`] = time
        }
      }
    }

    function getUpperBound() {
      return position + (5 / speed)
    }

  }
}

export default PlayerDisplay
