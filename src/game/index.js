import BemusePackageResources from 'bemuse/resources/bemuse-package'
import React from 'react'
import SCENE_MANAGER from 'bemuse/scene-manager'
import URLResource from 'bemuse/resources/url'
import audioContext from 'bemuse/audio-context'
import query from 'bemuse/utils/query'
import { resolveUrl } from 'url'
import { unmuteAudio } from 'bemuse/sampling-master'

import * as GameLoader from './loaders/game-loader'
import GameScene from './game-scene'
import GameShellScene from './ui/GameShellScene.jsx'
import LoadingScene from './ui/LoadingScene.jsx'

export async function main() {
  // iOS
  window.addEventListener('touchstart', function unmute() {
    unmuteAudio(audioContext)
    window.removeEventListener('touchstart', unmute)
  })

  let displayShell = function(options) {
    return new Promise(function(resolve) {
      let scene = React.createElement(GameShellScene, {
        options: options,
        play: function(data) {
          resolve(data)
        },
      })
      SCENE_MANAGER.display(scene).done()
    })
  }

  let getSong = async function() {
    let kbm = (query.keyboard || '').split(',').map(x => +x)
    let options = {
      url: query.bms || '/music/[snack]dddd/dddd_sph.bme',
      game: {
        audioInputLatency: +query.latency || 0,
      },
      players: [
        {
          speed: +query.speed || 3,
          autoplay: !!query.autoplay,
          placement: 'center',
          scratch: query.scratch || 'left',
          input: {
            keyboard: {
              '1': kbm[0] || 83,
              '2': kbm[1] || 68,
              '3': kbm[2] || 70,
              '4': kbm[3] || 32,
              '5': kbm[4] || 74,
              '6': kbm[5] || 75,
              '7': kbm[6] || 76,
              SC: kbm[7] || 65,
              SC2: kbm[8] || 16,
            },
          },
        },
      ],
    }
    options = await displayShell(options)
    let url = options.url
    let assetsUrl = resolveUrl(url, 'assets/')
    let metadata = {
      title: 'Loading',
      subtitles: [],
      artist: '',
      genre: '',
      subartists: [],
    }
    return {
      bms: options.resource || new URLResource(url),
      assets: options.resources || new BemusePackageResources(assetsUrl),
      metadata: metadata,
      options: Object.assign({}, options.game, { players: options.players }),
    }
  }

  let loadSpec = await getSong()
  let { tasks, promise } = GameLoader.load(loadSpec)
  await SCENE_MANAGER.display(
    React.createElement(LoadingScene, {
      tasks: tasks,
      song: loadSpec.metadata,
    })
  )
  let controller = await promise
  await SCENE_MANAGER.display(new GameScene(controller.display))
  controller.start()
}
