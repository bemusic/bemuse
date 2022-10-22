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
    const changes = new Map()
    for (const [name, control] of this._controls) {
      void name
      control.changed = false
    }
    for (const plugin of this._plugins) {
      for (const [name, value] of plugin.get()) {
        changes.set(name, value)
      }
    }
    for (const [name, value] of changes) {
      const control = this.get(name)!
      if (control.value !== value) {
        control.changed = true
        control.value = value
      }
    }
  }

  destroy() {
    for (const plugin of this._plugins) {
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
    const state: { [key: string]: number } = {}
    const name = 'input:' + plugin.name
    this._plugins.push({
      get: bench.wrap(name, function () {
        const out = plugin.get()
        const diff = []
        for (const key of _.union(_.keys(out), _.keys(state))) {
          const last = +state[key] || 0
          const current = +out[key] || 0
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
