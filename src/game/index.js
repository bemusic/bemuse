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
        audioInputLatency: +query.audioInputLatency || 0,
      },
      players: [
        {
          speed:      +query.speed || 3,
          autoplay:   !!query.autoplay,
          placement:  'center',
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
    yield SCENE_MANAGER.display(new LoadingScene({
      tasks: tasks,
      song: loadSpec.metadata,
    }))
    let controller = yield promise
    yield SCENE_MANAGER.display(new GameScene(controller.display))
    controller.start()
  })
  .done()
}
