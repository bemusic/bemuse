import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Draft } from 'immer'
import { MappingMode } from '../../rules/mapping-mode'
import { StoredOptions } from '../types'
import _ from 'lodash'

export type OptionsState = StoredOptions & Record<string, string>

// Initializers
export const initialState: OptionsState = {
  // Game mode (KB, BM)
  'player.P1.mode': 'KB',

  // Keyboard mapping
  'input.P1.keyboard.BM.SC': '16',
  'input.P1.keyboard.BM.SC2': '65',
  'input.P1.keyboard.BM.1': '90',
  'input.P1.keyboard.BM.2': '83',
  'input.P1.keyboard.BM.3': '88',
  'input.P1.keyboard.BM.4': '68',
  'input.P1.keyboard.BM.5': '67',
  'input.P1.keyboard.BM.6': '70',
  'input.P1.keyboard.BM.7': '86',

  'input.P1.keyboard.KB.1': '83',
  'input.P1.keyboard.KB.2': '68',
  'input.P1.keyboard.KB.3': '70',
  'input.P1.keyboard.KB.4': '32',
  'input.P1.keyboard.KB.5': '74',
  'input.P1.keyboard.KB.6': '75',
  'input.P1.keyboard.KB.7': '76',

  // Note speed
  'player.P1.speed': '1.0',
  'player.P1.lane-cover': '0',
  'player.P1.lead-time': '1685',
  'player.P1.auto-velocity': '0',

  // Scratch placement (left, right, off)
  'player.P1.scratch': 'left',

  // Panel placement (left, center, right)
  'player.P1.panel': 'center',

  // Gauge type (off, hope)
  'player.P1.gauge': 'off',

  // Gamepad settings
  'gamepad.continuous': '0',
  'gamepad.sensitivity': '4',

  // Offsets
  'system.offset.audio-input': '0',
  'system.offset.audio-visual': '0',

  // BGA
  'system.bga.enabled': '1',
  'system.preview.enabled': '1',

  // Version
  'system.last-seen-version': '0.0.0',

  // Acknowledgements (guide texts)
  'system.ack.twitter': '0',
  'system.ack.deltas': '0',
  'system.ack.finishGame': '0',
  'system.ack.replayGame': '0',
}
export const initWithDataFromStorage = (options: Record<string, string>) => {
  if (options['player.P1.scratch'] === 'off') {
    options['player.P1.scratch'] = 'left'
  }
  return {
    ...initialState,
    ...options,
  }
}

// Internal utils
const toggleOptionEnabled = (value: string) => value === '1'
const toggleOption = (value: string) => (toggleOptionEnabled(value) ? '0' : '1')

export const getKeyMapping =
  (mode: MappingMode, key: string) =>
  (state: OptionsState): MappingMode =>
    state['input.P1.keyboard.' + mode + '.' + key] as MappingMode

// Play mode
export const playMode = (state: OptionsState): MappingMode =>
  state['player.P1.mode'] as MappingMode
const _changePlayMode = (state: Draft<OptionsState>, mode: MappingMode) => {
  state['player.P1.mode'] = mode
  state['player.P1.panel'] =
    state['player.P1.panel'] === '3d' && mode !== 'KB'
      ? 'center'
      : state['player.P1.panel']
}

// Speed
export const speed = (state: OptionsState) => state['player.P1.speed']

// Lead time
export const leadTime = (state: OptionsState) => {
  const parsed = parseInt(state['player.P1.lead-time'], 10)
  if (!parsed) return 1685
  if (parsed < 138) return 138
  return parsed
}

// Scratch position
export const SCRATCH_POSITION = ['off', 'left', 'right'] as const
export type ScratchPosition = typeof SCRATCH_POSITION[number]
export const isScratchPosition = (str: string): str is ScratchPosition =>
  (SCRATCH_POSITION as readonly string[]).includes(str)
export const scratchPosition = (state: OptionsState): ScratchPosition => {
  if (state['player.P1.mode'] === 'KB') {
    return 'off'
  } else {
    return state['player.P1.scratch'] as ScratchPosition
  }
}

// Panel
export type PanelPlacement = 'left' | 'center' | 'right' | '3d'
export const panelPlacement = (state: OptionsState) => state['player.P1.panel']

// Lane cover
export const laneCover = (state: OptionsState) => {
  return (
    Math.min(
      50,
      Math.max(-50, Math.round(+state['player.P1.lane-cover'] * 100))
    ) / 100 || 0
  )
}

// BGA
export const isBackgroundAnimationsEnabled = (state: OptionsState) =>
  toggleOptionEnabled(state['system.bga.enabled'])

// Auto-velocity
export const isAutoVelocityEnabled = (state: OptionsState) =>
  toggleOptionEnabled(state['player.P1.auto-velocity'])

// Song preview enabled
export const isPreviewEnabled = (state: OptionsState) =>
  toggleOptionEnabled(state['system.preview.enabled'])

// Gauge
export type Gauge = 'off' | 'hope'
export const isGaugeEnabled = (state: OptionsState) => getGauge(state) !== 'off'
export const getGauge = (state: OptionsState): Gauge =>
  state['player.P1.gauge'] as Gauge

// Queries
export const keyboardMapping = (state: OptionsState) => {
  const mapping: Record<string, string> = {}
  for (const control of ['1', '2', '3', '4', '5', '6', '7', 'SC', 'SC2']) {
    const key = 'input.P1.keyboard.' + playMode(state) + '.' + control
    mapping[control] = state[key] || ''
  }
  return mapping
}

// Feature acknowledgements
export const hasAcknowledged = (featureKey: string) => (state: OptionsState) =>
  state[`system.ack.${featureKey}`] === '1'

// Audio-input latency
export const audioInputLatency = (state: OptionsState) =>
  +state['system.offset.audio-input']

// Gamepad Continuous Axis
export const isContinuousAxisEnabled = (state: OptionsState) =>
  toggleOptionEnabled(state['gamepad.continuous'])

// Gamepad Sensitivity
export const sensitivity = (state: OptionsState): number =>
  parseInt(state['gamepad.sensitivity'], 10)

// Latest version
export const lastSeenVersion = (state: OptionsState) =>
  state['system.last-seen-version']

// Utils
export const nextKeyToEdit = (editing: string, scratch: ScratchPosition) => {
  const keySet = (() => {
    if (scratch === 'left') {
      return ['SC', 'SC2', '1', '2', '3', '4', '5', '6', '7']
    } else if (scratch === 'right') {
      return ['1', '2', '3', '4', '5', '6', '7', 'SC', 'SC2']
    } else {
      return ['1', '2', '3', '4', '5', '6', '7']
    }
  })()
  const index = keySet.indexOf(editing)
  if (index < 0) return null
  return keySet[index + 1] || null
}

// Slice
export const optionsSlice = createSlice({
  name: 'options',
  initialState: initialState,
  reducers: {
    LOAD_FROM_STORAGE: () => {},
    LOADED_FROM_STORAGE: (
      _state,
      {
        payload: { options },
      }: PayloadAction<{ options: Record<string, string> }>
    ) => initWithDataFromStorage(options),
    INIT_WITH_DATA_FROM_STORAGE: (
      _state,
      {
        payload: { options },
      }: PayloadAction<{ options: Record<string, string> }>
    ) => ({
      ...initialState,
      ...options,
    }),
    CHANGE_KEY_MAPPING: (
      state,
      {
        payload: { mode, key, keyCode },
      }: PayloadAction<{
        mode: MappingMode
        key: string
        keyCode: string
      }>
    ) => {
      state['input.P1.keyboard.' + mode + '.' + key] = keyCode
    },
    CHANGE_PLAY_MODE: (
      state,
      { payload: { mode } }: PayloadAction<{ mode: MappingMode }>
    ) => {
      _changePlayMode(state, mode)
    },
    CHANGE_SPEED: (
      state,
      { payload: { speed } }: PayloadAction<{ speed: string }>
    ) => {
      state['player.P1.speed'] = speed
    },
    CHANGE_LEAD_TIME: (
      state,
      { payload: { leadTime } }: PayloadAction<{ leadTime: number }>
    ) => {
      state['player.P1.lead-time'] = leadTime.toString()
    },
    CHANGE_SCRATCH_POSITION: (
      state,
      { payload: { position } }: PayloadAction<{ position: ScratchPosition }>
    ) => {
      if (position === 'off') {
        _changePlayMode(state, 'KB')
        return
      }
      _changePlayMode(state, 'BM')
      state['player.P1.scratch'] = position
    },
    CHANGE_PANEL_PLACEMENT: (
      state,
      { payload: { placement } }: PayloadAction<{ placement: PanelPlacement }>
    ) => {
      state['player.P1.panel'] = placement
      state['player.P1.mode'] =
        placement === '3d' && state['player.P1.mode'] !== 'KB'
          ? 'KB'
          : state['player.P1.mode']
    },
    CHANGE_LANE_COVER: (
      state,
      { payload: { laneCover } }: PayloadAction<{ laneCover: number }>
    ) => {
      state['player.P1.lane-cover'] = `${laneCover}`
    },
    TOGGLE_BACKGROUND_ANIMATIONS: (state) => {
      state['system.bga.enabled'] = toggleOption(state['system.bga.enabled'])
    },
    TOGGLE_AUTO_VELOCITY: (state) => {
      state['player.P1.auto-velocity'] = toggleOption(
        state['player.P1.auto-velocity']
      )
    },
    TOGGLE_PREVIEW: (state) => {
      state['system.preview.enabled'] = toggleOption(
        state['system.preview.enabled']
      )
    },
    TOGGLE_GAUGE: (state) => {
      state['player.P1.gauge'] =
        state['player.P1.gauge'] === 'off' ? 'hope' : 'off'
    },
    ACKNOWLEDGE: (
      state,
      { payload: { featureKey } }: PayloadAction<{ featureKey: string }>
    ) => {
      state[`system.ack.${featureKey}`] = '1'
    },
    CHANGE_AUDIO_INPUT_LATENCY: (
      state,
      { payload: { latency } }: PayloadAction<{ latency: number }>
    ) => {
      state['system.offset.audio-input'] = `${latency}`
    },
    TOGGLE_CONTINUOUS_AXIS: (state) => {
      state['gamepad.continuous'] = toggleOption(state['gamepad.continuous'])
    },
    CHANGE_SENSITIVITY: (
      state,
      { payload: { sensitivity } }: PayloadAction<{ sensitivity: number }>
    ) => {
      state['gamepad.sensitivity'] = sensitivity.toString()
    },
    UPDATE_LAST_SEEN_VERSION: (
      state,
      { payload: { newVersion } }: PayloadAction<{ newVersion: string }>
    ) => {
      state['system.last-seen-version'] = newVersion
    },
  },
})
