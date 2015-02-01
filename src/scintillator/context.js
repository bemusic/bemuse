
import PIXI from 'pixi.js'

export class Context {
  constructor(skin) {
    this._skin     = skin
    this._instance = skin.instantiate(this)
    this._renderer = new PIXI.autoDetectRenderer(skin.width, skin.height)
    this.view = this._renderer.view
  }
  render(data) {
    this._instance.push(data)
    this._renderer.render(this.stage)
  }
  destroy() {
    this._instance.destroy()
    this._instance = null
  }
}

export default Context
