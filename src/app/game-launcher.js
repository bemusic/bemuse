
import co           from 'co'
import { resolve }  from 'url'
import screenfull   from 'screenfull'
import React        from 'react'

// TODO: remove this dependency and use Options
import query                  from 'bemuse/utils/query'
import { getGrade }           from 'bemuse/rules/grade'

import SCENE_MANAGER          from 'bemuse/scene-manager'
import URLResource            from 'bemuse/resources/url'
import BemusePackageResources from 'bemuse/resources/bemuse-package'
import * as GameLoader        from 'bemuse/game/loaders/game-loader'
import GameScene              from 'bemuse/game/game-scene'
import LoadingScene           from 'bemuse/game/ui/LoadingScene.jsx'
import ResultScene            from './ui/ResultScene'
import * as Analytics         from './analytics'
import * as OptionsActions    from './actions/options-actions'
import OptionsStore           from './stores/options-store'
import OptionsInputStore      from './stores/options-input-store'
import { MISSED }             from 'bemuse/game/judgments'

import { shouldDisableFullScreen, isTitleDisplayMode } from 'bemuse/devtools/query-flags'

export function launch ({ server, song, chart }) {
  return co(function*() {

    // go fullscreen
    if (screenfull.enabled && !shouldDisableFullScreen()) {
      let safari = /Safari/.test(navigator.userAgent) &&
                  !/Chrom/.test(navigator.userAgent)
      if (!safari) screenfull.request()
    }

    // get the options from the store
    let optionsStoreState = OptionsStore.get()
    let options = optionsStoreState.options

    // initialize the loading specification
    let loadSpec  = { }
    if (song.resources) {
      loadSpec.assets = song.resources
      loadSpec.bms    = yield song.resources.file(chart.file)
    } else {
      let url         = server.url + '/' + song.path + '/' + encodeURIComponent(chart.file)
      let assetsUrl   = resolve(url, 'assets/')
      loadSpec.bms    = new URLResource(url)
      loadSpec.assets = new BemusePackageResources(assetsUrl, {
        fallback: url,
        fallbackPattern: /\.(?:png|jpg)/,
      })
    }

    let latency = +query.latency || (+options['system.offset.audio-input'] / 1000) || 0

    loadSpec.options = {
      audioInputLatency: latency,
      tutorial: song.tutorial,
      players: [
        {
          speed:      +options['player.P1.speed'] || 1,
          autoplay:   false,
          placement:  options['player.P1.panel'],
          scratch:    optionsStoreState.scratch,
          input: {
            keyboard: OptionsInputStore.get().keyCodes,
          },
        },
      ],
    }

    // start loading the game
    let loader = GameLoader.load(loadSpec)
    let { tasks, promise } = loader

    // display loading scene
    let loadingScene = React.createElement(LoadingScene, {
      tasks: tasks,
      song: chart.info,
      eyecatchImagePromise: loader.get('EyecatchImage')
    })
    yield SCENE_MANAGER.push(loadingScene)

    // if in title display mode, stop
    if (isTitleDisplayMode()) return

    // send data to analytics
    Analytics.gameStart(song, chart, optionsStoreState.scratch ? 'BM' : 'KB')

    // wait for game to load and display the game
    let controller = yield promise
    yield SCENE_MANAGER.display(new GameScene(controller.display))
    controller.start()

    // wait for final game state
    let state = yield controller.promise

    // send data to analytics
    Analytics.gameFinish(song, chart, state)

    // get player's state and save options
    let playerState = state.player(state.game.players[0])
    OptionsActions.setOptions({
      'player.P1.speed': playerState.speed,
    })

    // display evaluation
    if (state.finished) {
      yield showResult(playerState, chart)
    }
    controller.destroy()

    // go back to previous scene
    yield SCENE_MANAGER.pop()

  })
}

function showResult (playerState, chart) {
  return new Promise(_resolve => {
    let stats     = playerState.stats
    let playMode  = playerState.player.options.scratch === 'off' ? 'KB' : 'BM'
    let props = {
      result: {
        '1':          stats.counts['1'],
        '2':          stats.counts['2'],
        '3':          stats.counts['3'],
        '4':          stats.counts['4'],
        'missed':     stats.counts[MISSED],
        'score':      stats.score,
        'maxCombo':   stats.maxCombo,
        'accuracy':   stats.accuracy,
        'totalCombo': stats.totalCombo,
        'log':        stats.log,
        'deltas':     stats.deltas,
        'grade':      getGrade(stats),
      },
      chart:    chart,
      playMode: playMode,
      onExit:   _resolve,
    }
    SCENE_MANAGER.display(React.createElement(ResultScene, props)).done()
  })
}
