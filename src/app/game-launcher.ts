import BemusePackageResources from 'bemuse/resources/bemuse-package'
import GameScene from 'bemuse/game/game-scene'
import LoadingScene from 'bemuse/game/ui/LoadingScene.jsx'
import React from 'react'
import SCENE_MANAGER from 'bemuse/scene-manager'
import URLResource from 'bemuse/resources/url'
import invariant from 'invariant'
import query from 'bemuse/utils/query'
import { MISSED } from 'bemuse/game/judgments'
import { getGrade } from 'bemuse/rules/grade'
import { isTitleDisplayMode } from 'bemuse/devtools/query-flags'
import { resolve as resolveUrl } from 'url'
import { unmuteAudio } from 'bemuse/sampling-master'

import * as Analytics from './analytics'
import * as Options from './entities/Options'
import ResultScene from './ui/ResultScene'
import createAutoVelocity from './interactors/createAutoVelocity'
import { Song, Chart, StoredOptions } from './types'
import { LoadSpec } from 'bemuse/game/loaders/game-loader'
import Player from 'bemuse/game/player'
import PlayerState from 'bemuse/game/state/player-state'

const Log = BemuseLogger.forModule('game-launcher')

if (module.hot) {
  module.hot.accept('bemuse/game/loaders/game-loader')
}

type LaunchOptions = {
  server: { url: string }
  song: Song
  chart: Chart
  options: StoredOptions
  saveSpeed: (speed: number) => void
  saveLeadTime: (speed: number) => void
  onRagequitted: () => void
}

export async function launch({
  server,
  song,
  chart,
  options,
  saveSpeed,
  saveLeadTime,
  onRagequitted,
}: LaunchOptions) {
  // Unmute audio immediately so that it sounds on iOS and Chrome and some other browsers as well!
  unmuteAudio()

  // get the options from the store
  invariant(options, 'Options must be passed!')

  // initialize the loading specification
  // TODO [#625]: Create the LoadSpec object at the end instead of building object from blank.
  let loadSpec: LoadSpec = {} as any
  loadSpec.songId = song.id

  if (song.resources) {
    loadSpec.assets = song.resources
    loadSpec.bms = await song.resources.file(chart.file)
  } else {
    let url =
      server.url + '/' + song.path + '/' + encodeURIComponent(chart.file)
    let assetsUrl = resolveUrl(url, 'assets/')
    loadSpec.bms = new URLResource(url)
    loadSpec.assets = new BemusePackageResources(assetsUrl, {
      fallback: url,
      fallbackPattern: /\.(?:png|jpg|webm|mp4|m4v)/,
    })
  }

  const latency =
    +query.latency || +options['system.offset.audio-input'] / 1000 || 0
  const volume = getVolume(song)
  const scratch = Options.scratchPosition(options)
  const keyboardMapping = Options.keyboardMapping(options)

  // Speed handling
  const autoVelocity = createAutoVelocity({
    enabled: Options.isAutoVelocityEnabled(options),
    initialSpeed: +options['player.P1.speed'] || 1,
    laneCover: Options.laneCover(options),
    desiredLeadTime: Options.leadTime(options),
    songBPM: chart.bpm.median,
  })

  loadSpec.options = {
    audioInputLatency: latency,
    soundVolume: volume,
    tutorial: !!song.tutorial,
    players: [
      {
        speed: autoVelocity.getInitialSpeed(),
        placement: options['player.P1.panel'],
        scratch: scratch,
        laneCover: Options.laneCover(options),
        gauge: Options.getGauge(options),
        input: {
          keyboard: keyboardMapping as any,
        },
      },
    ],
  }

  if (options['player.P1.panel'] === '3d') {
    loadSpec.displayMode = 'touch3d'
  }

  // set video options
  if (Options.isBackgroundAnimationsEnabled(options)) {
    loadSpec.videoUrl = await findVideoUrl(song, loadSpec.assets)
    loadSpec.videoOffset = +(song.video_offset || 0)
  }

  let replay = false

  do {
    // start loading the game
    const loadStart = Date.now()
    Log.info(`Loading game: ${describeChart(chart)}`)
    const GameLoader: typeof import('bemuse/game/loaders/game-loader') = require('bemuse/game/loaders/game-loader')
    let loader = GameLoader.load(loadSpec)
    let { tasks, promise } = loader

    // display loading scene
    let loadingScene = React.createElement(LoadingScene, {
      tasks: tasks,
      song: chart.info,
      eyecatchImagePromise: loader.get('EyecatchImage'),
    })
    if (replay) {
      await SCENE_MANAGER.display(loadingScene)
    } else {
      await SCENE_MANAGER.push(loadingScene)
    }
    replay = false

    // if in title display mode, stop
    if (isTitleDisplayMode()) return

    // send data to analytics
    const gameMode = scratch ? 'BM' : 'KB'
    Analytics.gameStart(song, chart, gameMode, options)

    // wait for game to load and display the game
    let controller = await promise
    await SCENE_MANAGER.display(GameScene(controller.display))
    controller.start()

    // send the timing data
    const loadFinish = Date.now()
    Analytics.recordGameLoadTime(loadFinish - loadStart)

    // listen to unload events
    const onUnload = () => {
      Analytics.gameQuit(song, chart, state)
    }
    window.addEventListener('beforeunload', onUnload, false)

    // wait for final game state
    const playResult = await controller.promise
    const state = controller.state
    const game = controller.game
    const [player] = game.players

    // get player's state and save options
    const playerState = state.player(state.game.players[0])
    const playerSpeed = playerState.speed
    autoVelocity.handleGameFinish(playerSpeed, { saveSpeed, saveLeadTime })
    loadSpec.options.players[0].speed = playerSpeed

    // send data to analytics & display evaluation
    window.removeEventListener('beforeunload', onUnload, false)
    if (state.finished) {
      Analytics.gameFinish(song, chart, state, gameMode)
      const exitResult = await showResult(player, playerState, chart)
      replay = exitResult.replay
    } else {
      Analytics.gameEscape(song, chart, state)
      replay = playResult.replay
      if (!replay) {
        if (song.tutorial && controller.latestGameTime! > 96) onRagequitted()
      }
    }
    controller.destroy()
  } while (replay)

  // go back to previous scene
  await SCENE_MANAGER.pop()
}

async function findVideoUrl(song: Song, assets: LoadSpec['assets']) {
  if (song.video_url) {
    return song.video_url
  }
  if (song.video_file) {
    try {
      const file = await assets.file(song.video_file)
      if (file.resolveUrl) {
        return await file.resolveUrl()
      }
    } catch (e) {
      console.warn('[game-launcher] findVideoUrl: Cannot load video file:', e)
    }
  }
}

function showResult(player: Player, playerState: PlayerState, chart: Chart) {
  return new Promise<{ replay: boolean }>(resolve => {
    let stats = playerState.stats
    let playMode = playerState.player.options.scratch === 'off' ? 'KB' : 'BM'
    let props = {
      result: {
        '1': stats.counts['1'],
        '2': stats.counts['2'],
        '3': stats.counts['3'],
        '4': stats.counts['4'],
        missed: stats.counts[MISSED],
        score: stats.score,
        maxCombo: stats.maxCombo,
        accuracy: stats.accuracy,
        totalCombo: stats.totalCombo,
        totalNotes: stats.totalNotes,
        log: stats.log,
        deltas: stats.deltas,
        tainted: playerState.tainted,
        grade: playerState.tainted ? 'AUTOPLAY' : getGrade(stats),
      },
      chart: chart,
      playMode: playMode,
      lr2Timegate: player.notechart.expertJudgmentWindow,
      onExit: () => resolve({ replay: false }),
      onReplay: () => resolve({ replay: true }),
    }
    SCENE_MANAGER.display(React.createElement(ResultScene, props)).done()
  })
}

// http://qiita.com/dtinth/items/1200681c517a3fb26357
const DEFAULT_REPLAYGAIN = -12.2 // dB

function getVolume(song: Song) {
  const gain = replayGainFor(song)
  return Math.pow(10, ((gain == null ? DEFAULT_REPLAYGAIN : gain) + 8) / 20)
}

function replayGainFor(song: Song) {
  if (typeof song.replaygain !== 'string') return null
  if (!/^\S+\s+dB$/.test(song.replaygain)) return null
  const gain = parseFloat(song.replaygain)
  if (isNaN(gain)) return null
  return gain
}

function describeChart(chart: Chart) {
  const { info } = chart
  return `[${info.genre}] ${info.title} ／ ${info.artist}`
}
