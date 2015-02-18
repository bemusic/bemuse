
import co from 'co'
import BMS from 'bms'

import { EventEmitter } from 'events'
import TaskList         from 'bemuse/task-list'
import LoadingContext   from 'bemuse/boot/loading-context'

import AudioLoader      from './audio-loader'

export class GameLoader extends EventEmitter {
  constructor() {
    this._tasks = new TaskList()
    this._tasks.on('progress', () => this.emit('progress'))
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
    let tasks = {
      engine: this._task('Loading game engine'),
      skin:   this._task('Loading skin'),
    }
    return co(function*() {
      let Scintillator  = yield loadEngineModule(tasks.engine)
      let skin          = yield Scintillator.load('/skins/default/skin.xml',
                                  tasks.skin)
      let context       = new Scintillator.Context(skin)
      return { skin, context }
    }.bind(this))
  }
  _loadSong(song) {
    let { bms, assets } = song
    let tasks = {
      bms:    this._task('Loading ' + bms.name),
      pack:   this._task('Loading song package'),
      audio:  this._task('Loading audio'),
      bga:    this._task('Loading BGA'),
      decode: this._task('Decoding audio'),
    }
    return co(function*() {
      let buffer        = yield bms.read(tasks.bms)
      let source        = yield readBMS(buffer)
      let compileResult = BMS.Compiler.compile(source)
      let chart         = compileResult.chart
      let keysounds     = BMS.Keysounds.fromBMSChart(chart)
      let audioLoader   = new AudioLoader(assets)
      audioLoader.audioTask   = tasks.audio
      audioLoader.decodeTask  = tasks.decode
      let audio         = yield audioLoader.loadFrom(keysounds)
      console.log(audio)
    }.bind(this))
  }
  _task(text) {
    return this._tasks.task(text)
  }
  get tasks() {
    return this._tasks
  }
}

function loadEngineModule(task) {
  return new Promise((resolve) => {
    let context = new LoadingContext(task)
    context.use(function() {
      require.ensure(
        ['bemuse/scintillator'],
        function(require) {
          task.update({ progress: 1 })
          resolve(require('bemuse/scintillator'))
        },
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
