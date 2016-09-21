import * as Options from './entities/Options'

import mean from 'mean'
import median from 'median'
import variance from 'variance'
import ObjectID from 'bson-objectid'
import { timegate } from 'bemuse/game/judgments'
import { MISSED } from 'bemuse/game/judgments'
import { stringify } from 'qs'

let ga = window.ga || function () { }
const startTime = Date.now()
const sid = ObjectID.generate()

function getLabel (chart) {
  return `${chart.md5}`
}

function getSongTitle (song) {
  if (song.custom) return '(custom song)'
  return song.title
}

export function send (category, action, label, value, extra) {
  console.log('[Analytics]', category, action, label, value, extra)
  ga('send', 'event', category, action, label, value)
  try {
    if (window.ga) {
      const sessionLength = Date.now() - startTime
      const data = { info: { sid, category, action, label, value, extra, t: sessionLength } }
      window.navigator.sendBeacon('https://analytics.bemuse.ninja/collect.php?' + stringify(data))
    }
  } catch (e) {
    console.warn('[Analytics]', 'Cannot send', e)
  }
}

export function gameStart (song, chart, gameMode, options) {
  send('song', 'play', getSongTitle(song))
  send('game', 'start', getLabel(chart), chart.info.level, {
    gameMode,
    bga: Options.isBackgroundAnimationsEnabled(options) ? 'y' : 'n',
    autoVelocity: Options.isAutoVelocityEnabled(options) ? 'y' : 'n',
    latency: +options['system.offset.audio-input']
  })
  send('game', 'mode', gameMode)
}

export function gameFinish (song, chart, gameState, gameMode) {
  const state = gameState.player(gameState.game.players[0])
  const stats = state.stats
  send('song', 'finish', getSongTitle(song))
  send('game', 'finish', getLabel(chart), stats.score, {
    gameMode: gameMode,
    level: chart.info.level,
    bpm: chart.bpm.median,
    speed: state.speed,
    score: stats.score,
    maxCombo: stats.maxCombo,
    totalCombo: stats.totalCombo,
    accuracy: stats.accuracy,
    stats: getDeltaStats(stats.deltas),
    counts: {
      'w1': stats.counts['1'],
      'w2': stats.counts['2'],
      'w3': stats.counts['3'],
      'w4': stats.counts['4'],
      'w5': stats.counts[MISSED]
    },
  })
}

export function recordGameLoadTime (gameLoadTimeMillis) {
  console.log(`[Analytics] Game load time: ${gameLoadTimeMillis} ms`)
  ga('send', 'timing', 'Game', 'load', gameLoadTimeMillis)
}

export function getDeltaStats (deltas) {
  const nonMissDeltas = deltas.filter(delta => Math.abs(delta) < timegate(4))
  return {
    sd: Math.sqrt(variance(nonMissDeltas)),
    mean: mean(nonMissDeltas),
    median: median(nonMissDeltas),
  }
}

export function gameEscape (song, chart, gameState) {
  let state = gameState.player(gameState.game.players[0])
  send('song', 'escape', getSongTitle(song))
  send('game', 'escape', getLabel(chart), state.stats.score)
}

export function gameQuit (song, chart, gameState) {
  let state = gameState.player(gameState.game.players[0])
  send('song', 'quit', getSongTitle(song))
  send('game', 'quit', getLabel(chart), state.stats.score)
}

export function action (label) {
  send('action', 'trigger', label)
}
