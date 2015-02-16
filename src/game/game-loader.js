
import co from 'co'
import bytes from 'bytes'
import { basename } from 'path'

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
      let tasks = {
        engine: this._task('Loading game engine'),
        skin:   this._task('Loading skin'),
        bms:    this._task('Loading ' + basename(bms)),
      }
      let promises = {
        graphics: co(function*() {
          let Scintillator  = yield loadEngine(tasks.engine)
          let skin          = yield Scintillator.load('/skins/default/skin.xml',
                                      tasks.skin)
          let context       = new Scintillator.Context(skin)
          return { skin, context }
        }.bind(this)),
        song: co(function*() {
          let buffer = yield download(bms).as('arraybuffer', tasks.bms)
          return buffer
        }.bind(this)),
      }
      yield Promise.all([promises.graphics, promises.song])
    }.bind(this))
  }
  _task(text) {
    return this._tasks.task(text)
  }
  get tasks() {
    return this._tasks
  }
}

function loadEngine(task) {
  return new Promise((resolve) => {
    let context = new LoadingContext()
    context.onprogress = function(loaded, total) {
      task.update({
        current:  bytes(loaded),
        total:    bytes(total),
        progress: loaded / total,
      })
    }
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

export default GameLoader
