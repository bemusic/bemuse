
import co from 'co'
import { basename } from 'path'
import BMS from 'bms'

import { EventEmitter } from 'events'
import TaskList         from 'bemuse/task-list'
import LoadingContext   from 'bemuse/boot/loading-context'
import download         from 'bemuse/download'

export class GameLoader extends EventEmitter {
  constructor() {
    this._tasks = new TaskList()
    this._tasks.on('progress', () => this.emit('progress'))
  }
  load(bms) {
    return co(function*() {
      let promises = {
        graphics: this._loadEngine(),
        song:     this._loadSong(bms),
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
  _loadSong(bms) {
    let tasks = {
      bms:    this._task('Loading ' + basename(bms)),
      pack:   this._task('Loading song package'),
      audio:  this._task('Loading audio'),
      bga:    this._task('Loading BGA'),
      decode: this._task('Decoding audio'),
    }
    return co(function*() {
      let buffer = yield download(bms).as('arraybuffer', tasks.bms)
      let source = yield readBMS(buffer)
      let compileResult = BMS.Compiler.compile(source)
      let chart = compileResult.chart
      let songInfo = BMS.SongInfo.fromBMSChart(chart)
      void songInfo
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
