
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

export function launch({ server, song, chart, scene: originalScene }) {
  return co(function*() {
    if (screenfull.enabled) {
      let safari = /Safari/.test(navigator.userAgent) &&
                  !/Chrom/.test(navigator.userAgent)
      if (!safari) screenfull.request()
    }
    let url       = server.url + '/' + song.path + '/' + chart.file
    let assetsUrl = resolve(url, 'assets/')
    let loadSpec = {
      bms:      new URLResource(url),
      assets:   new BemusePackageResources(assetsUrl),
      options:  {
        audioInputLatency: +query.latency || 0,
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
    let { tasks, promise } = GameLoader.load(loadSpec)
    let loadingScene = React.createElement(LoadingScene, {
      tasks: tasks,
      song:  chart.info,
    })
    Analytics.gameStart(song, chart)
    yield SCENE_MANAGER.display(loadingScene)
    let controller = yield promise
    yield SCENE_MANAGER.display(new GameScene(controller.display))
    controller.start()
    let state = yield controller.promise
    Analytics.gameFinish(song, chart, state)
    let playerState = state.player(state.game.players[0])
    Options.set('player.P1.speed', playerState.speed)
    if (state.finished) {
      // TODO: display evaluation result
      void 0
    }
    controller.destroy()
    yield SCENE_MANAGER.display(originalScene)

  })
}
