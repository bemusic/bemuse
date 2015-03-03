
import co from 'co'
import BMS from 'bms'

import Progress         from 'bemuse/progress'
import SamplingMaster   from 'bemuse/sampling-master'
import LoadingContext   from 'bemuse/boot/loading-context'

import SamplesLoader    from './samples-loader'
import * as Multitasker from './multitasker'
import Game             from '../game'
import GameController   from '../game-controller'
import GameAudio        from '../audio'
import GameDisplay      from '../display'

export function load(spec) {

  let assets = spec.assets
  let bms    = spec.bms

  return Multitasker.start(function(task, run) {

    task('Scintillator', 'Loading game engine', [], function(progress) {
      return new Promise((resolve) => {
        let context = new LoadingContext(progress)
        context.use(function() {
          require.ensure(
            ['bemuse/scintillator'],
            (require) => resolve(require('bemuse/scintillator')),
            'gameEngine'
          )
        })
      })
    })

    task('Skin', 'Loading skin', ['Scintillator'],
    function(Scintillator, progress) {
      return Scintillator.load('/skins/default/skin.xml', progress)
    })

    task('SkinContext', null, ['Scintillator', 'Skin'],
    function(Scintillator, skin) {
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

    task('BMSChart', 'Loading ' + spec.bms.name, [],
    co.wrap(function*(progress) {
      let arraybuffer   = yield bms.read(progress)
      let buffer        = new Buffer(new Uint8Array(arraybuffer))
      let source        = yield Promise.promisify(BMS.Reader.readAsync)(buffer)
      let compileResult = BMS.Compiler.compile(source)
      let chart         = compileResult.chart
      return chart
    }))

    let audioLoadProgress   = new Progress()
    let audioDecodeProgress = new Progress()

    task.bar('Loading audio',  audioLoadProgress)
    task.bar('Decoding audio', audioDecodeProgress)

    task('SamplingMaster', null, [], function() {
      return new SamplingMaster()
    })

    task('Game', null, ['BMSChart'],
    function(chart) {
      return new Game(chart, { players: [{}] })
    })

    task('GameDisplay', null, ['Game', 'Skin', 'SkinContext'],
    function(game, skin, context) {
      return new GameDisplay({ game, skin, context })
    })

    task('Samples', null, ['SamplingMaster', 'Game'],
    function(master, game) {
      let samplesLoader = new SamplesLoader(assets, master)
      return samplesLoader.loadFiles(game.samples,
          audioLoadProgress, audioDecodeProgress)
    })

    task('GameAudio', null, ['Game', 'Samples', 'SamplingMaster'],
    function(game, samples, master) {
      return new GameAudio({ game, samples, master })
    })

    task('GameController', null, ['Game', 'GameDisplay', 'GameAudio'],
    function(game, display, audio) {
      return new GameController({ game, display, audio })
    })

    return run('GameController')

  })

}

