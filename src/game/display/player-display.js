import * as touch3d from './touch3d'
import NoteArea from './note-area'
import { MISSED, breaksCombo } from '../judgments'
import { getGauge } from './Gauge'

export class PlayerDisplay {
  constructor(player, skinData) {
    this._currentSpeed = 1
    this._player = player
    this._noteArea = new NoteArea(
      player.notechart.notes,
      player.notechart.barLines
    )
    this._stateful = {}
    this._defaultData = {
      placement: player.options.placement,
      scratch: player.options.scratch,
      key_mode: player.notechart.getKeyMode(player.options.scratch),
      lane_lift: Math.max(0, -player.options.laneCover),
      lane_press: Math.max(0, player.options.laneCover),
    }
    this._gauge = getGauge(player.options.gauge)
    this._touch3dMode = skinData.displayMode === 'touch3d'
  }
  update(time, gameTime, playerState) {
    const touch3dMode = this._touch3dMode
    let player = this._player
    let noteArea = this._noteArea
    let stateful = this._stateful
    let beat = player.notechart.secondsToBeat(gameTime)
    let position = player.notechart.beatToPosition(beat)
    let spacing = player.notechart.spacingAtBeat(beat)
    let data = Object.assign({}, this._defaultData)
    let push = (key, value) => (data[key] || (data[key] = [])).push(value)
    let gauge = this._gauge

    this._currentSpeed += (playerState.speed - this._currentSpeed) / 3
    let speed = this._currentSpeed * spacing

    updateBeat()
    updateVisibleNotes()
    updateBarLines()
    updateInput()
    updateJudgment()
    updateGauge()
    updateExplode()

    data['speed'] = playerState.speed.toFixed(1) + 'x'
    data['stat_1'] = getCount(1)
    data['stat_2'] = getCount(2)
    data['stat_3'] = getCount(3)
    data['stat_4'] = getCount(4)
    data['stat_missed'] = getCount(MISSED)
    data['stat_acc'] = getAccuracy()
    const bpm = player.notechart.bpmAtBeat(beat)
    data['bpm'] = bpm < 1 ? '' : Math.round(bpm) % 10000 || ''

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
      if (touch3dMode) {
        const putNote = (id, noteY, column, scale = 1) => {
          const row = touch3d.getRow(noteY - 0.01)
          const columnIndex = +column || -1
          const areaWidth = touch3d.PLAY_AREA_WIDTH
          const xOffset =
            row.projection * areaWidth * ((2 * (columnIndex - 0.5)) / 7 - 1)
          const desiredWidth = (row.projection * scale * areaWidth * 2) / 7
          push(`note3d_${column}`, {
            key: id,
            y: row.y,
            x: xOffset + 1280 / 2,
            width: desiredWidth,
          })
        }
        let longNoteStep = 3 / 128
        for (let entity of entities) {
          let note = entity.note
          let column = note.column
          if (entity.height) {
            let c = 0
            let start = entity.y + entity.height
            for (
              let i =
                start -
                Math.max(
                  0,
                  Math.floor((start - 1) / longNoteStep) * longNoteStep
                );
              i >= 0 && i >= entity.y;
              i -= longNoteStep
            ) {
              putNote(note.id + 'x' + c++, i, column, 0.8)
            }
            putNote(note.id, entity.y + entity.height, column)
          } else {
            if (playerState.getNoteStatus(note) !== 'judged') {
              putNote(note.id, entity.y, column)
            }
          }
        }
      } else {
        for (let entity of entities) {
          let note = entity.note
          let column = note.column
          if (entity.height) {
            let judgment = playerState.getNoteJudgment(note)
            let status = playerState.getNoteStatus(note)
            push(`longnote_${column}`, {
              key: note.id,
              y: entity.y,
              height: entity.height,
              active: judgment !== 0 && judgment !== MISSED,
              missed: status === 'judged' && judgment === MISSED,
            })
          } else {
            if (playerState.getNoteStatus(note) !== 'judged') {
              push(`note_${column}`, {
                key: note.id,
                y: entity.y,
              })
            }
          }
        }
      }
    }

    function updateBarLines() {
      let entities = noteArea.getVisibleBarLines(position, getUpperBound(), 1)
      for (let entity of entities) {
        if (touch3dMode) {
          const row = touch3d.getRow(entity.y - 0.01)
          push('barlines3d', {
            key: entity.id,
            y: row.y,
            x: row.projection * -touch3d.PLAY_AREA_WIDTH + 1280 / 2,
            width: row.projection * touch3d.PLAY_AREA_WIDTH * 2,
          })
        } else {
          push('barlines', { key: entity.id, y: entity.y })
        }
      }
    }

    function updateInput() {
      let input = playerState.input
      for (let column of player.columns) {
        let control = input.get(column)
        data[`${column}_active`] = control.value !== 0 ? 1 : 0
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
        let name =
          notification.judgment === -1 ? 'missed' : `${notification.judgment}`
        stateful[`judge_${name}`] = time
        let deviationMode =
          notification.judgment === -1 || notification.judgment === 1
            ? 'none'
            : notification.delta > 0
            ? 'late'
            : notification.delta < 0
            ? 'early'
            : 'none'
        stateful[`judge_deviation_${deviationMode}`] = time
        stateful['combo'] = notification.combo
      }
      data['score'] = playerState.stats.score
    }

    function updateGauge() {
      gauge.update(playerState)
      if (gauge.shouldDisplay()) {
        if (!stateful['gauge_enter']) stateful['gauge_enter'] = time
      } else {
        if (stateful['gauge_enter']) {
          if (!stateful['gauge_exit']) stateful['gauge_exit'] = time
        }
      }
      data['gauge_primary'] = gauge.getPrimary()
      data['gauge_secondary'] = gauge.getSecondary()
      data['gauge_extra'] = gauge.getExtra()
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
      return position + 5 / speed
    }
  }
}

export default PlayerDisplay
