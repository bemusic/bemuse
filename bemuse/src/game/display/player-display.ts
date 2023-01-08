import * as touch3d from './touch3d'

import { Gauge, getGauge } from './Gauge'
import { JudgedJudgment, MISSED, breaksCombo } from '../judgments'
import Player, { PlayerOptionsPlacement, PlayerOptionsScratch } from '../player'

import NoteArea from './note-area'
import PlayerState from '../state/player-state'

interface PlayerData {
  placement: PlayerOptionsPlacement
  scratch: PlayerOptionsScratch
  key_mode: string
  lane_lift: number
  lane_press: number
}

export class PlayerDisplay {
  constructor(private readonly player: Player, skinData: TODO) {
    this._currentSpeed = 1
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
    } as const
    this._gauge = getGauge(player.options.gauge)
    this._touch3dMode = skinData.displayMode === 'touch3d'
  }

  private _currentSpeed: number
  private _noteArea: NoteArea
  private _stateful: Record<string, number>
  private readonly _defaultData: Readonly<PlayerData>
  private _gauge: Gauge
  private _touch3dMode: boolean

  update(time: number, gameTime: number, playerState: PlayerState) {
    const beat = this.player.notechart.secondsToBeat(gameTime)
    const position = this.player.notechart.beatToPosition(beat)
    const spacing = this.player.notechart.spacingAtBeat(beat)
    const data: Record<string, unknown> = { ...this._defaultData }
    const push = (key: string, value: unknown) => {
      if (!(key in data)) {
        data[key] = []
      }
      ;(data[key] as unknown[]).push(value)
    }

    this._currentSpeed += (playerState.speed - this._currentSpeed) / 3
    const speed = this._currentSpeed * spacing

    this.updateBeat(data, beat)
    this.updateVisibleNotes(playerState, position, speed, push)
    this.updateBarLines(position, speed, push)
    this.updateInput(playerState, time, data)
    this.updateJudgment(playerState, time, data)
    this.updateGauge(playerState, time, data)
    this.updateExplode(playerState, time)

    data.speed = playerState.speed.toFixed(1) + 'x'
    data.stat_1 = this.getCount(playerState, 1)
    data.stat_2 = this.getCount(playerState, 2)
    data.stat_3 = this.getCount(playerState, 3)
    data.stat_4 = this.getCount(playerState, 4)
    data.stat_missed = this.getCount(playerState, MISSED)
    data.stat_acc = this.getAccuracy(playerState)
    const bpm = this.player.notechart.bpmAtBeat(beat)
    data.bpm = bpm < 1 ? '' : Math.round(bpm) % 10000 || ''

    return { ...data, ...this._stateful }
  }

  private updateBeat(data: Record<string, unknown>, beat: number) {
    data.beat = beat
  }

  private getCount(playerState: PlayerState, judgment: JudgedJudgment) {
    return playerState.stats.counts && playerState.stats.counts[judgment]
  }

  private getAccuracy(playerState: PlayerState) {
    return ((playerState.stats.currentAccuracy || 0) * 100).toFixed(2) + '%'
  }

  private updateVisibleNotes(
    playerState: PlayerState,
    position: number,
    speed: number,
    push: (key: string, value: unknown) => void
  ) {
    const entities = this._noteArea.getVisibleNotes(
      position,
      this.getUpperBound(position, speed),
      1
    )
    if (this._touch3dMode) {
      const putNote = (
        id: string | number,
        noteY: number,
        column?: string,
        scale = 1
      ) => {
        const row = touch3d.getRow(noteY - 0.01)
        const columnIndex = +(column ?? '-1')
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
      const longNoteStep = 3 / 128
      for (const entity of entities) {
        const note = entity.note
        const column = note.column
        if (entity.height) {
          let c = 0
          const start = entity.y + entity.height
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
      for (const entity of entities) {
        const note = entity.note
        const column = note.column
        if (entity.height) {
          const judgment = playerState.getNoteJudgment(note)
          const status = playerState.getNoteStatus(note)
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

  private updateBarLines(
    position: number,
    speed: number,
    push: (key: string, value: unknown) => void
  ) {
    const entities = this._noteArea.getVisibleBarLines(
      position,
      this.getUpperBound(position, speed),
      1
    )
    for (const entity of entities) {
      if (this._touch3dMode) {
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

  private updateJudgment(
    playerState: PlayerState,
    time: number,
    data: Record<string, unknown>
  ) {
    const notifications = playerState.notifications.judgments
    const notification = notifications[notifications.length - 1]
    if (notification) {
      const name =
        notification.judgment === -1 ? 'missed' : `${notification.judgment}`
      this._stateful[`judge_${name}`] = time
      const deviationMode =
        notification.judgment === -1 || notification.judgment === 1
          ? 'none'
          : notification.delta > 0
          ? 'late'
          : notification.delta < 0
          ? 'early'
          : 'none'
      this._stateful[`judge_deviation_${deviationMode}`] = time
      this._stateful['combo'] = notification.combo
    }
    data['score'] = playerState.stats.score
  }

  private updateGauge(
    playerState: PlayerState,
    time: number,
    data: Record<string, unknown>
  ) {
    this._gauge.update(playerState)
    if (this._gauge.shouldDisplay()) {
      if (!this._stateful['gauge_enter']) this._stateful['gauge_enter'] = time
    } else {
      if (this._stateful['gauge_enter']) {
        if (!this._stateful['gauge_exit']) this._stateful['gauge_exit'] = time
      }
    }
    data['gauge_primary'] = this._gauge.getPrimary()
    data['gauge_secondary'] = this._gauge.getSecondary()
    data['gauge_extra'] = this._gauge.getExtra()
  }

  private updateExplode(playerState: PlayerState, time: number) {
    const notifications = playerState.notifications.judgments
    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i]
      if (!breaksCombo(notification.judgment)) {
        this._stateful[`${notification.column}_explode`] = time
      }
    }
  }

  private getUpperBound(position: number, speed: number) {
    return position + 5 / speed
  }

  private updateInput(
    playerState: PlayerState,
    time: number,
    data: Record<string, unknown>
  ) {
    const input = playerState.input
    for (const column of this.player.columns) {
      const control = input.get(column)!
      data[`${column}_active`] = control.value !== 0 ? 1 : 0
      if (control.changed) {
        if (control.value !== 0) {
          this._stateful[`${column}_down`] = time
        } else {
          this._stateful[`${column}_up`] = time
        }
      }
    }
  }
}

export default PlayerDisplay
