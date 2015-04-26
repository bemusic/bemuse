import co from 'co'

import SCENE_MANAGER  from 'bemuse/scene-manager'
import query          from 'bemuse/utils/query'
import React          from 'react'
import LoadingScene   from './ui/loading-scene.jsx'
import GameShellScene from './ui/game-shell-scene.jsx'
import GameScene      from './game-scene'

import URLResource            from 'bemuse/resources/url'
import BemusePackageResources from 'bemuse/resources/bemuse-package'
import { unmuteAudio }        from 'bemuse/sampling-master'
import audioContext           from 'audio-context'

import { resolve } from 'url'

import * as GameLoader from './loaders/game-loader'

export function main() {

  // iOS
  window.addEventListener('touchstart', function unmute() {
    unmuteAudio(audioContext)
    window.removeEventListener('touchstart', unmute)
  })

  let displayShell = function(options) {
    return new Promise(function(_resolve) {
      let scene = React.createElement(GameShellScene, {
        options: options,
        play: function(data) {
          _resolve(data)
        },
      })
      SCENE_MANAGER.display(scene).done()
    })
  }

  let getSong = co.wrap(function*() {
    let kbm = (query.keyboard || '').split(',').map(x => +x)
    let options = {
      url: query.bms || '/music/[snack]ddddevelopers/dddd_sph.bme',
      game: {
        audioInputLatency: +query.audioInputLatency || 0,
      },
      players: [
        {
          speed:      +query.speed || 3.5,
          autoplay:   !!query.autoplay,
          placement:  'center',
          input: {
            keyboard: {
              '1':  kbm[0] || 83,
              '2':  kbm[1] || 68,
              '3':  kbm[2] || 70,
              '4':  kbm[3] || 32,
              '5':  kbm[4] || 74,
              '6':  kbm[5] || 75,
              '7':  kbm[6] || 76,
              'SC': kbm[7] || 65,
            },
          },
        }
      ],
    }
    options = yield displayShell(options)
    let url = options.url
    let assetsUrl = resolve(url, 'assets/')
    let metadata = {
      title: 'Loading',
      subtitles: [],
      artist: '',
      genre: '',
      subartists: [],
    }
    let loadSpec = {
      bms:      options.resource  || new URLResource(url),
      assets:   options.resources || new BemusePackageResources(assetsUrl),
      metadata: metadata,
      options:  Object.assign({ }, options.game, { players: options.players }),
    }
    return loadSpec
  })

  co(function*() {
    let loadSpec = yield getSong()
    let { tasks, promise } = GameLoader.load(loadSpec)
    yield SCENE_MANAGER.display(React.createElement(LoadingScene, {
      tasks: tasks,
      song: loadSpec.metadata,
    }))
    let controller = yield promise
    yield SCENE_MANAGER.display(new GameScene(controller.display))
    controller.start()
  })
  .done()
}
