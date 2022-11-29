import * as Analytics from './analytics'
import * as Options from './entities/Options'

import { Chart, Song } from 'bemuse/collection-model/types'

import GameScene from 'bemuse/game/game-scene'
import GenericErrorScene from './ui/GenericErrorScene'
import { LoadSpec } from 'bemuse/game/loaders/game-loader'
import LoadingScene from 'bemuse/game/ui/LoadingScene'
import { MISSED } from 'bemuse/game/judgments'
import Player from 'bemuse/game/player'
import PlayerState from 'bemuse/game/state/player-state'
import React from 'react'
import ResultScene from './ui/ResultScene'
import { SceneManagerController } from '.'
import { StoredOptions } from './types'
import createAutoVelocity from './interactors/createAutoVelocity'
import { getGrade } from 'bemuse/rules/grade'
import { getSongResources } from 'bemuse/music-collection/getSongResources'
import { getSoundVolume } from './query-flags'
import invariant from 'invariant'
import { isTitleDisplayMode } from 'bemuse/devtools/query-flags'
import query from 'bemuse/utils/query'
import { unmuteAudio } from 'bemuse/sampling-master'

const Log = BemuseLogger.forModule('game-launcher')

if (module.hot) {
  module.hot.accept('bemuse/game/loaders/game-loader')
}

export type LaunchOptions = {
  server: { url: string }
  song: Song
  chart: Chart
  options: StoredOptions
  saveSpeed: (speed: number) => void
  saveLeadTime: (speed: number) => void
  onRagequitted: () => void
  autoplayEnabled: boolean
  sceneManager: SceneManagerController
}

export async function launch(launchOptions: LaunchOptions) {
  const sceneDisplayContext = new SceneDisplayContext(
    launchOptions.sceneManager
  )
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
    autoplayEnabled,
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
  const loadSpec: LoadSpec = {} as any
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
        autoplayEnabled: autoplayEnabled,
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
    const loader = GameLoader.load(loadSpec)
    const { tasks, promise } = loader

    // display loading scene
    const loadingScene = React.createElement(LoadingScene, {
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
    const controller = await promise
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
    const tryToLoad = async (name: string) => {
      try {
        const file = await assets.file(name)
        if (file.resolveUrl) {
          return await file.resolveUrl()
        }
      } catch (e) {
        console.warn(
          `[game-launcher] findVideoUrl: Cannot load video file "${name}":`,
          e
        )
      }
    }
    const extensionRegExp = /\.\w+$/
    const replaceExtension = (name: string, ext: string) =>
      name.replace(extensionRegExp, ext)
    const filesToTry: string[] = []
    if (/\.webm$/i.test(song.video_file)) {
      filesToTry.push(song.video_file)
      filesToTry.push(replaceExtension(song.video_file, '.mp4'))
    } else if (extensionRegExp.test(song.video_file)) {
      filesToTry.push(replaceExtension(song.video_file, '.mp4'))
      filesToTry.push(replaceExtension(song.video_file, '.webm'))
    }
    for (const name of filesToTry) {
      const url = await tryToLoad(name)
      if (url) return url
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
    const stats = playerState.stats
    const playMode = playerState.player.options.scratch === 'off' ? 'KB' : 'BM'
    const props: ResultSceneProps = {
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
    } as const
    sceneDisplayContext
      .showScene(React.createElement(ResultScene, props))
      .catch(reject)
  })
}

interface ResultSceneProps {
  result: Result
  chart: Chart
  playMode: 'KB' | 'BM'
  lr2Timegate: [number, number]
  onExit: () => void
  onReplay: () => void
}

interface Result {
  '1': number
  '2': number
  '3': number
  '4': number
  missed: number
  score: number
  maxCombo: number
  accuracy: number
  totalCombo: number
  totalNotes: number
  log: string
  deltas: number[]
  tainted: boolean
  grade: 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'AUTOPLAY'
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
  constructor(private readonly sceneManager: SceneManagerController) {}
  shown = false
  async showScene(scene: any) {
    if (!this.shown) {
      await this.sceneManager.push(scene)
      this.shown = true
    } else {
      await this.sceneManager.display(scene)
    }
  }

  async end() {
    if (this.shown) {
      await this.sceneManager.pop()
      this.shown = false
    }
  }
}
