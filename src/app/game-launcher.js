
import co           from 'co'
import { resolve }  from 'url'
import screenfull   from 'screenfull'
import React        from 'react'

// TODO: remove this dependency and use Options
import query                  from 'bemuse/utils/query'

import SCENE_MANAGER          from 'bemuse/scene-manager'
import URLResource            from 'bemuse/resources/url'
import BemusePackageResources from 'bemuse/resources/bemuse-package'
import * as GameLoader        from 'bemuse/game/loaders/game-loader'
import GameScene              from 'bemuse/game/game-scene'
import LoadingScene           from 'bemuse/game/ui/loading-scene.jsx'
import * as Options           from './options'
import * as Analytics         from './analytics'

import { shouldDisableFullScreen } from 'bemuse/devtools/query-flags'

export function launch({ server, song, chart }) {
  return co(function*() {

    // go fullscreen
    if (screenfull.enabled && !shouldDisableFullScreen()) {
      let safari = /Safari/.test(navigator.userAgent) &&
                  !/Chrom/.test(navigator.userAgent)
      if (!safari) screenfull.request()
    }

    // prepare data necessary to load the game
    let url       = server.url + '/' + song.path + '/' + chart.file
    let assetsUrl = resolve(url, 'assets/')
    let loadSpec = {
      bms:      new URLResource(url),
      assets:   new BemusePackageResources(assetsUrl),
      options:  {
        audioInputLatency: +query.latency || 0,
        tutorial: song.tutorial,
        players: [
          {
            speed:      +Options.get('player.P1.speed') || 1,
            autoplay:   false,
            placement:  Options.get('player.P1.panel'),
            scratch:    Options.get('player.P1.scratch'),
            input: {
              keyboard: Options.getKeyboardMapping(),
            }
          },
        ],
      },
    }

    // start loading the game
    let { tasks, promise } = GameLoader.load(loadSpec)

    // display loading scene
    let loadingScene = React.createElement(LoadingScene, {
      tasks: tasks,
      song:  chart.info,
    })
    yield SCENE_MANAGER.push(loadingScene)

    // send data to analytics
    Analytics.gameStart(song, chart)

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
    Options.set('player.P1.speed', playerState.speed)

    // display evaluation
    if (state.finished) {
      // TODO: display evaluation result
      void 0
    }
    controller.destroy()

    // go back to previous scene
    yield SCENE_MANAGER.pop()

  })
}
