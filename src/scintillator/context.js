
import PIXI from 'pixi.js'

class Bindings {
  constructor() {
    this._listeners = {}
    this._next = 1
  }
  run(data) {
    for (let id in this._listeners) {
      this._listeners[id](data)
    }
  }
  bind(...pipeline) {
    return this._add(function(value) {
      for (let f of pipeline) value = f(value)
    })
  }
  _add(f) {
    let id = this._next++
    this._listeners[id] = f
    return () => {
      delete this._listeners[id]
    }
  }
}

export class Context {
  constructor(skin, data={}) {
    this._bindings = new Bindings()
    this.bind = this._bindings.bind.bind(this._bindings)
    this._skin     = skin
    this._instance = skin.instantiate(this)
    this._renderer = new PIXI.autoDetectRenderer(skin.width, skin.height)
    this.view = this._renderer.view
    this.data = data
    this.render()
  }
  render() {
    this._bindings.run(this.data)
    this._renderer.render(this.stage)
  }
}

export default Context
