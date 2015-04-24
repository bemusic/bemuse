
import Control  from './control'
import _        from 'lodash'

function GamepadPlugin() {
  let gamepads = []
  window.addEventListener('gamepadconnected', function(e) {
    gamepads.push(e.gamepad)
  })
  function button(i) {
    return gamepads.some(gamepad => gamepad.buttons[i].pressed)
  }
  function axis(i) {
    for (var j = 0; j < gamepads.length; j++) {
      var gamepad = gamepads[j]
      if (Math.abs(gamepad.axes[i]) > 0.01) return gamepad.axes[i]
    }
    return 0
  }
  return {
    get() {
      var out = {
        'p1_1': button(3),
        'p1_2': button(6),
        'p1_3': button(2),
        'p1_4': button(7),
        'p1_5': button(1),
        'p1_6': button(4),
        'p1_7': axis(3),
        'p1_SC': axis(4),
        'start': button(9),
        'select': button(8),
      }
      out['p1_speedup'] = (out['start'] || out['select']) && (
        out['p1_2'] || out['p1_4'] || out['p1_6'])
      out['p1_speeddown'] = (out['start'] || out['select']) && (
        out['p1_1'] || out['p1_3'] || out['p1_5'] || out['p1_7'])
      return out
    }
  }
}

export class GameInput {
  constructor() {
    this._controls = new Map()
    this._plugins = []
    this.use(new GamepadPlugin())
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
      for (let key of _.union(_.keys(out), _.keys(state))) {
        let last    = +state[key] || 0
        let current = +out[key]   || 0
        if (last !== current) diff.push([key, current])
        state[key] = current
      }
      return diff
    })
  }
}

export default GameInput
