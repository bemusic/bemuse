
import Control  from './control'
import _        from 'lodash'
import bench    from 'bemuse/devtools/benchmark'

export class GameInput {
  constructor() {
    this._controls = new Map()
    this._plugins = []
  }
  update() {
    let changes = new Map()
    /* jshint -W098 */
    /* jshint -W004 */
    // https://github.com/jshint/jshint/issues/2138
    for (let [name, control] of this._controls) {
      void name
      control.changed = false
    }
    for (let plugin of this._plugins) {
      for (let [name, value] of plugin.get()) {
        changes.set(name, value)
      }
    }
    for (let [name, value] of changes) {
      let control = this.get(name)
      if (control.value !== value) {
        control.changed = true
        control.value = value
      }
    }
    /* jshint +W098 */
    /* jshint +W004 */
    // https://github.com/jshint/jshint/issues/2138
  }
  destroy() {
    for (let plugin of this._plugins) {
      plugin.destroy()
    }
  }
  get(controlName) {
    if (!this._controls.has(controlName)) {
      this._controls.set(controlName, new Control())
    }
    return this._controls.get(controlName)
  }
  use(plugin) {
    let state = { }
    let name = 'input:' + plugin.name
    this._plugins.push({
      get: bench.wrap(name, function() {
        let out = plugin.get()
        let diff = [ ]
        for (let key of _.union(_.keys(out), _.keys(state))) {
          let last    = +state[key] || 0
          let current = +out[key]   || 0
          if (last !== current) diff.push([key, current])
          state[key] = current
        }
        return diff
      }),
      destroy() {
        if (typeof plugin.destroy === 'function') {
          return plugin.destroy()
        } else {
          return true
        }
      },
    })
  }
}

export default GameInput
