import co from 'co'

import SCENE_MANAGER  from 'bemuse/scene-manager'
import query          from 'bemuse/query'
import LoadingScene   from './loading-scene'
import GameScene      from './game-scene'
import GameShellScene from './shell-scene'

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
    return new Promise(function(resolve) {
      let scene = new GameShellScene({
        options: options,
        play: function(data) {
          resolve(data)
        },
      })
      SCENE_MANAGER.display(scene)
    })
  }

  let getSong = co.wrap(function*() {
    let options = {
      url: query.bms || '/music/[ricora]ourjourney/hyper.bms',
      game: {
      },
      players: [
        {
          speed: 3,
        }
      ],
    }
    options = yield displayShell(options)
    let url = options.url
    let assetsUrl = resolve(url, 'assets/')
    let metadata = {
      title: url,
      subtitles: [],
      artist: '...',
      genre: '...',
      subartists: [],
    }
    let loadSpec = {
      bms:    new URLResource(url),
      assets: new BemusePackageResources(assetsUrl),
    }
    return { metadata, loadSpec }
  })

  co(function*() {
    let { metadata, loadSpec } = yield getSong()
    let { tasks, promise } = GameLoader.load(loadSpec)
    yield SCENE_MANAGER.display(new LoadingScene({ tasks, song: metadata }))
    let controller = yield promise
    yield SCENE_MANAGER.display(new GameScene(controller.display))
    controller.start()
  })
  .done()
}
