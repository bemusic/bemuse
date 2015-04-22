
import co           from 'co'
import { resolve }  from 'url'
import screenfull   from 'screenfull'
import React        from 'react'

import query                  from 'bemuse/utils/query'
import SCENE_MANAGER          from 'bemuse/scene-manager'
import URLResource            from 'bemuse/resources/url'
import BemusePackageResources from 'bemuse/resources/bemuse-package'
import * as GameLoader        from 'bemuse/game/loaders/game-loader'
import GameScene              from 'bemuse/game/game-scene'
import LoadingScene           from 'bemuse/game/ui/loading-scene.jsx'

export function launch({ server, song, chart }) {
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
            speed:      +query.speed || 3,
            autoplay:   false,
            placement:  'center',
          },
        ],
      },
    }
    let { tasks, promise } = GameLoader.load(loadSpec)
    let scene = React.createElement(LoadingScene, {
      tasks: tasks,
      song:  chart.info,
    })
    yield SCENE_MANAGER.display(scene)
    let controller = yield promise
    yield SCENE_MANAGER.display(new GameScene(controller.display))
    controller.start()
  })
}
