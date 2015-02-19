
import co from 'co'
import BMS from 'bms'

import Progress           from 'bemuse/progress'
import * as ProgressUtils from 'bemuse/progress/utils'

import { EventEmitter } from 'events'
import LoadingContext   from 'bemuse/boot/loading-context'

import AudioLoader      from './audio-loader'
import bytes            from 'bytes'

let Formatters = {
  NORMAL: progress =>
            progress.total ? `${progress.current} / ${progress.total}` : '',
  EXTRA:  progress =>
            progress.extra,
  BYTES:  progress =>
            progress.total ?
              `${bytes(progress.current)} / ${bytes(progress.total)}` : '',
}

export class GameLoader extends EventEmitter {
  constructor() {
    this._tasks = []
  }
  get tasks() {
    return this._tasks
  }
  load(song) {
    return co(function*() {
      let promises = {
        graphics: this._loadEngine(),
        song:     this._loadSong(song),
      }
      yield Promise.all([promises.graphics, promises.song])
    }.bind(this))
  }
  _loadEngine() {
    let progress = {
      engine: this._task('Loading game engine',     Formatters.BYTES),
      skin:   this._task('Loading skin'),
    }
    return co(function*() {
      let Scintillator  = yield loadEngineModule(progress.engine)
      let skin          = yield Scintillator.load('/skins/default/skin.xml',
                                  progress.skin)
      let context       = new Scintillator.Context(skin)
      return { skin, context }
    }.bind(this))
  }
  _loadSong(song) {
    let { bms, assets } = song
    let progress = {
      bms:    this._task('Loading ' + bms.name,     Formatters.BYTES),
      cpack:  this._task('Loading package',         Formatters.BYTES),
      pack:   this._task('Loading song packages'),
      audio:  this._task('Loading audio'),
      bga:    this._task('Loading BGA'),
      decode: this._task('Decoding audio',          Formatters.EXTRA),
    }
    if (assets.progress) {
      if (assets.progress.current) {
        ProgressUtils.bind(assets.progress.current, progress.cpack)
      }
      if (assets.progress.all) {
        ProgressUtils.bind(assets.progress.all, progress.pack)
      }
    }
    return co(function*() {
      let buffer        = yield bms.read(progress.bms)
      let source        = yield readBMS(buffer)
      let compileResult = BMS.Compiler.compile(source)
      let chart         = compileResult.chart
      let keysounds     = BMS.Keysounds.fromBMSChart(chart)
      let audioLoader   = new AudioLoader(assets)
      let audio         = yield audioLoader.loadFrom(keysounds,
                            progress.audio, progress.decode)
      console.log(audio)
    }.bind(this))
  }
  _task(text, formatter) {
    formatter = formatter || Formatters.NORMAL
    let progress = new Progress()
    let task = { text: text, progress: null, progressText: '' }
    this._tasks.push(task)
    progress.watch(() => {
      task.progressText = formatter(progress)
      task.progress     = progress.progress
      this.emit('progress')
    })
    return progress
  }
}

function loadEngineModule(progress) {
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
}

function readBMS(buffer) {
  buffer = new Buffer(new Uint8Array(buffer))
  return Promise.promisify(BMS.Reader.readAsync)(buffer)
}

export default GameLoader
