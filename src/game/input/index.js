
import $ from 'jquery'
import Control from './control'
import R from 'ramda'

function HardcodedKeyboardPlugin() {
  let data = { }
  $(window)
  .keydown(e => data[e.which] = 1)
  .keyup(e => data[e.which] = 0)
  return {
    get() {
      return {
        'p1_1': data[82],
        'p1_2': data[83],
        'p1_3': data[84],
        'p1_4': data[32],
        'p1_5': data[78],
        'p1_6': data[69],
        'p1_7': data[73],
        'p1_SC': data[65],
      }
    }
  }
}

export class GameInput {
  constructor() {
    this._controls = new Map()
    this._plugins = []
    this.use(new HardcodedKeyboardPlugin())
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
      for (let [name, value] of plugin()) {
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
  get(controlName) {
    if (!this._controls.has(controlName)) {
      this._controls.set(controlName, new Control())
    }
    return this._controls.get(controlName)
  }
  use(plugin) {
    let state = { }
    this._plugins.push(function() {
      let out = plugin.get()
      let diff = [ ]
      for (let key of R.union(R.keys(out), R.keys(state))) {
        let last    = +state[key] || 0
        let current = +out[key]   || 0
        if (last !== current) diff.push([key, current])
      }
      return diff
    })
  }
}

export default GameInput

