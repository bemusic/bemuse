import Control from './control'
import _ from 'lodash'
import bench from 'bemuse/devtools/benchmark'

type GameInputPluginInternalInstance = {
  get(): [string, number][]
  destroy(): void
}

interface IGameInputPlugin {
  name: string
  get(): { [key: string]: number }
  destroy?(): void
}

export class GameInput {
  private _controls = new Map<string, Control>()
  private _plugins: GameInputPluginInternalInstance[] = []
  update() {
    let changes = new Map()
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
      let control = this.get(name)!
      if (control.value !== value) {
        control.changed = true
        control.value = value
      }
    }
  }
  destroy() {
    for (let plugin of this._plugins) {
      plugin.destroy()
    }
  }
  get(controlName: string) {
    if (!this._controls.has(controlName)) {
      this._controls.set(controlName, new Control())
    }
    return this._controls.get(controlName)!
  }
  use(plugin: IGameInputPlugin) {
    let state: { [key: string]: number } = {}
    let name = 'input:' + plugin.name
    this._plugins.push({
      get: bench.wrap(name, function () {
        let out = plugin.get()
        let diff = []
        for (let key of _.union(_.keys(out), _.keys(state))) {
          let last = +state[key] || 0
          let current = +out[key] || 0
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
