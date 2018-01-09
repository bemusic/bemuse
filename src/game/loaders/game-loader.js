import LoadingContext from 'bemuse/boot/loading-context'
import NotechartLoader from 'bemuse-notechart/loader'
import Progress from 'bemuse/progress'
import SamplingMaster from 'bemuse/sampling-master'
import co from 'co'
import keysoundCache from 'bemuse/keysound-cache'

import * as Multitasker from './multitasker'
import Game from '../game'
import GameAudio from '../audio'
import GameController from '../game-controller'
import GameDisplay from '../display'
import SamplesLoader from './samples-loader'
import loadImage from './loadImage'

export function load (spec) {
  const assets = spec.assets
  const bms = spec.bms
  const songId = spec.songId

  return Multitasker.start(function (task, run) {
    task('Scintillator', 'Loading game engine', [], function (progress) {
      return new Promise(resolve => {
        let context = new LoadingContext(progress)
        context.use(function () {
          require.ensure(
            ['bemuse/scintillator'],
            require => resolve(require('bemuse/scintillator')),
            'gameEngine'
          )
        })
      })
    })

    task('Skin', 'Loading skin', ['Scintillator'], function (
      Scintillator,
      progress
    ) {
      return Scintillator.load(
        Scintillator.getSkinUrl({
          displayMode: spec.displayMode
        }),
        progress
      )
    })

    task('SkinContext', null, ['Scintillator', 'Skin'], function (
      Scintillator,
      skin
    ) {
      return new Scintillator.Context(skin)
    })

    if (assets.progress) {
      if (assets.progress.current) {
        task.bar('Loading package', assets.progress.current)
      }
      if (assets.progress.all) {
        task.bar('Loading song packages', assets.progress.all)
      }
    }

    task(
      'Notechart',
      'Loading ' + spec.bms.name,
      [],
      co.wrap(function * (progress) {
        let loader = new NotechartLoader()
        let arraybuffer = yield bms.read(progress)
        return yield loader.load(arraybuffer, spec.bms, spec.options.players[0])
      })
    )

    task('EyecatchImage', null, ['Notechart'], function (notechart) {
      return loadImage(assets, notechart.eyecatchImage)
    })

    task('BackgroundImage', null, ['Notechart'], function (notechart) {
      return loadImage(assets, notechart.backgroundImage)
    })

    let audioLoadProgress = new Progress()
    let audioDecodeProgress = new Progress()

    task.bar('Loading audio', audioLoadProgress)
    task.bar('Decoding audio', audioDecodeProgress)

    task('SamplingMaster', null, [], function () {
      return new SamplingMaster()
    })

    task(
      'Video',
      spec.videoUrl ? 'Loading video' : null,
      ['Notechart'],
      function (notechart, progress) {
        if (!spec.videoUrl) return Promise.resolve(null)
        return new Promise((resolve, reject) => {
          const video = document.createElement('video')
          if (!video.canPlayType('video/webm')) return resolve(null)
          video.src = spec.videoUrl
          video.preload = 'auto'
          video.addEventListener('progress', onProgress, true)
          video.addEventListener('canplaythrough', onCanPlayThrough, true)
          video.addEventListener('error', onError, true)
          video.addEventListener('abort', onError, true)
          video.load()

          function onProgress (e) {
            if (video.buffered && video.buffered.length && video.duration) {
              progress.report(
                video.buffered.end(0) - video.buffered.start(0),
                video.duration
              )
            }
          }
          function finish () {
            video.removeEventListener('progress', onProgress, true)
            video.removeEventListener('canplaythrough', onCanPlayThrough, true)
            video.removeEventListener('error', onError, true)
            video.removeEventListener('abort', onError, true)
          }
          function onCanPlayThrough () {
            finish()
            const n = video.duration || 100
            progress.report(n, n)
            resolve({ element: video, offset: spec.videoOffset })
          }
          function onError () {
            finish()
            console.warn('Cannot load video... Just skip it!')
            resolve(null)
          }
        })
      }
    )

    task('Game', null, ['Notechart'], function (notechart) {
      return new Game([notechart], spec.options)
    })

    task(
      'GameDisplay',
      null,
      ['Game', 'Skin', 'SkinContext', 'Video'],
      function (game, skin, context, video) {
        return new GameDisplay({
          game,
          skin,
          context,
          backgroundImagePromise: run('BackgroundImage'),
          video
        })
      }
    )

    task('Samples', null, ['SamplingMaster', 'Game'], function (master, game) {
      keysoundCache.receiveSongId(songId)
      const samplesLoader = new SamplesLoader(assets, master)
      return samplesLoader.loadFiles(
        game.samples,
        audioLoadProgress,
        audioDecodeProgress
      )
    })

    task('GameAudio', null, ['Game', 'Samples', 'SamplingMaster'], function (
      game,
      samples,
      master
    ) {
      return new GameAudio({ game, samples, master })
    })

    task('GameController', null, ['Game', 'GameDisplay', 'GameAudio'], function (
      game,
      display,
      audio
    ) {
      return new GameController({ game, display, audio })
    })

    return run('GameController')
  })
}
