import { getSongResources } from 'bemuse/music-collection/getSongResources'
import { Chart, Song } from 'bemuse/collection-model/types'
import { isTitleDisplayMode } from 'bemuse/devtools/query-flags'
import GameScene from 'bemuse/game/game-scene'
import { MISSED } from 'bemuse/game/judgments'
import { LoadSpec } from 'bemuse/game/loaders/game-loader'
import Player from 'bemuse/game/player'
import PlayerState from 'bemuse/game/state/player-state'
import LoadingScene from 'bemuse/game/ui/LoadingScene.jsx'
import { getGrade } from 'bemuse/rules/grade'
import { unmuteAudio } from 'bemuse/sampling-master'
import SCENE_MANAGER from 'bemuse/scene-manager'
import query from 'bemuse/utils/query'
import invariant from 'invariant'
import React from 'react'
import * as Analytics from './analytics'
import * as Options from './entities/Options'
import createAutoVelocity from './interactors/createAutoVelocity'
import { StoredOptions } from './types'
import GenericErrorScene from './ui/GenericErrorScene'
import ResultScene from './ui/ResultScene'
import { getSoundVolume } from './query-flags'

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

export async function launch(launchOptions: LaunchOptions) {
  const sceneDisplayContext = new SceneDisplayContext()
  let currentWork = 'launching the game'
  try {
    await launchGame(
      launchOptions,
      sceneDisplayContext,
      (work) => (currentWork = work)
    )
  } catch (e) {
    await new Promise<void>((resolve, reject) => {
      sceneDisplayContext
        .showScene(
          GenericErrorScene.getScene({
            preamble: `Bemuse has encountered a problem while ${currentWork}`,
            error: e as Error,
            onContinue: resolve,
          })
        )
        .catch(reject)
    })
  } finally {
    await sceneDisplayContext.end()
  }
}

async function launchGame(
  {
    server,
    song,
    chart,
    options,
    saveSpeed,
    saveLeadTime,
    onRagequitted,
  }: LaunchOptions,
  sceneDisplayContext: SceneDisplayContext,
  setCurrentWork: (work: string) => void
) {
  // Unmute audio immediately so that it sounds on iOS and Chrome and some other browsers as well!
  unmuteAudio()

  // get the options from the store
  invariant(options, 'Options must be passed!')

  // initialize the loading specification
  // TODO [#625]: Create the LoadSpec object at the end instead of building object from blank.
  let loadSpec: LoadSpec = {} as any
  loadSpec.songId = song.id

  const { baseResources, assetResources } = getSongResources(song, server.url)
  loadSpec.assets = assetResources
  loadSpec.bms = await baseResources.file(chart.file)

  if (song.eyecatch_image_url) {
    loadSpec.eyecatchImageUrl = song.eyecatch_image_url
  }
  if (song.back_image_url) {
    loadSpec.backImageUrl = song.back_image_url
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
          continuous: Options.isContinuousAxisEnabled(options),
          sensitivity: Options.sensitivity(options),
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
    setCurrentWork('loading the game')
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
    await sceneDisplayContext.showScene(loadingScene)
    replay = false

    // if in title display mode, stop here
    if (isTitleDisplayMode()) return

    // send data to analytics
    const gameMode = scratch ? 'BM' : 'KB'
    Analytics.gameStart(song, chart, gameMode, options)

    // wait for game to load and display the game
    let controller = await promise
    setCurrentWork('running the game')
    await sceneDisplayContext.showScene(GameScene(controller.display))
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
    setCurrentWork('handling game results')

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
      setCurrentWork('showing game results')
      Analytics.gameFinish(song, chart, state, gameMode)
      const exitResult = await showResult(
        player,
        playerState,
        chart,
        sceneDisplayContext
      )
      replay = exitResult.replay
    } else {
      setCurrentWork('exiting the game')
      Analytics.gameEscape(song, chart, state)
      replay = playResult.replay
      if (!replay) {
        if (song.tutorial && controller.latestGameTime! > 96) onRagequitted()
      }
    }
    controller.destroy()
  } while (replay)
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

function showResult(
  player: Player,
  playerState: PlayerState,
  chart: Chart,
  sceneDisplayContext: SceneDisplayContext
) {
  return new Promise<{ replay: boolean }>((resolve, reject) => {
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
    sceneDisplayContext
      .showScene(React.createElement(ResultScene, props))
      .catch(reject)
  })
}

// http://qiita.com/dtinth/items/1200681c517a3fb26357
const DEFAULT_REPLAYGAIN = -12.2 // dB

function getVolume(song: Song) {
  const gain = replayGainFor(song)
  return (
    Math.pow(10, ((gain == null ? DEFAULT_REPLAYGAIN : gain) + 4) / 20) *
    getSoundVolume()
  )
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

class SceneDisplayContext {
  shown = false
  async showScene(scene: any) {
    if (!this.shown) {
      await SCENE_MANAGER.push(scene)
      this.shown = true
    } else {
      await SCENE_MANAGER.display(scene)
    }
  }
  async end() {
    if (this.shown) {
      await SCENE_MANAGER.pop()
      this.shown = false
    }
  }
}
