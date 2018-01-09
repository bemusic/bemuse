import _ from 'lodash'
import u from 'updeep'

import * as options from '../options'

// Initializers
export const initialState = options.DEFAULTS
export const initWithDataFromStorage = options => ({
  ...initialState,
  ...options
})

// Internal utils
const toggleOptionEnabled = value => value === '1'
const toggleOption = value => (toggleOptionEnabled(value) ? '0' : '1')

// Key mapping
export const getKeyMapping = (mode, key) => state =>
  state['input.P1.keyboard.' + mode + '.' + key]
export const changeKeyMapping = (mode, key, keyCode) =>
  u({
    ['input.P1.keyboard.' + mode + '.' + key]: keyCode
  })

// Play mode
export const playMode = state => state['player.P1.mode']
export const changePlayMode = mode =>
  u({
    'player.P1.mode': mode,
    'player.P1.panel': panel =>
      panel === '3d' && mode !== 'KB' ? 'center' : panel
  })

// Speed
export const speed = state => state['player.P1.speed']
export const changeSpeed = speed => u({ 'player.P1.speed': speed })

// Lead time
export const leadTime = state => {
  const parsed = parseInt(state['player.P1.lead-time'], 10)
  if (!parsed) return 1685
  if (parsed < 138) return 138
  return parsed
}
export const changeLeadTime = leadTime => u({ 'player.P1.lead-time': leadTime })

// Scratch position
export const scratchPosition = state => {
  if (state['player.P1.mode'] === 'KB') {
    return 'off'
  } else {
    return state['player.P1.scratch']
  }
}
export const changeScratchPosition = position => {
  if (position === 'off') {
    return changePlayMode('KB')
  } else {
    return _.flow(changePlayMode('BM'), u({ 'player.P1.scratch': position }))
  }
}

// Panel
export const panelPlacement = state => state['player.P1.panel']
export const changePanelPlacement = placement =>
  u({
    'player.P1.panel': placement,
    'player.P1.mode': mode =>
      placement === '3d' && mode !== 'KB' ? 'KB' : mode
  })

// Lane cover
export const laneCover = state => {
  return (
    Math.min(
      50,
      Math.max(-50, Math.round(state['player.P1.lane-cover'] * 100))
    ) / 100 || 0
  )
}
export const changeLaneCover = laneCover =>
  u({ 'player.P1.lane-cover': laneCover })

// BGA
export const isBackgroundAnimationsEnabled = state =>
  toggleOptionEnabled(state['system.bga.enabled'])
export const toggleBackgroundAnimations = u({
  'system.bga.enabled': toggleOption
})

// Auto-velocity
export const isAutoVelocityEnabled = state =>
  toggleOptionEnabled(state['player.P1.auto-velocity'])
export const toggleAutoVelocity = u({
  'player.P1.auto-velocity': toggleOption
})

// Song preview enabled
export const isPreviewEnabled = state =>
  toggleOptionEnabled(state['system.preview.enabled'])
export const togglePreview = u({
  'system.preview.enabled': toggleOption
})

// Gauge
export const isGaugeEnabled = state => getGauge(state) !== 'off'
export const getGauge = state => state['player.P1.gauge']
export const toggleGauge = u({
  'player.P1.gauge': gauge => (gauge === 'off' ? 'hope' : 'off')
})

// Queries
export const keyboardMapping = state => {
  let mapping = {}
  for (let control of ['1', '2', '3', '4', '5', '6', '7', 'SC', 'SC2']) {
    let key = 'input.P1.keyboard.' + playMode(state) + '.' + control
    mapping[control] = state[key] || ''
  }
  return mapping
}

// Feature acknowledgements
export const hasAcknowledged = featureKey => state =>
  state[`system.ack.${featureKey}`] === '1'
export const acknowledge = featureKey =>
  u({
    [`system.ack.${featureKey}`]: '1'
  })

// Audio-input latency
export const audioInputLatency = state => +state['system.offset.audio-input']
export const changeAudioInputLatency = latency =>
  u({
    'system.offset.audio-input': `${latency}`
  })

// Latest version
export const lastSeenVersion = state => state['system.last-seen-version']
export const updateLastSeenVersion = newVersion =>
  u({
    'system.last-seen-version': newVersion
  })

// Utils
export const nextKeyToEdit = (editing, scratch) => {
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
