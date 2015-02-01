
import PIXI from 'pixi.js'

export class Context {
  constructor(skin) {
    this._skin     = skin
    this._instance = skin.instantiate(this)
    this._renderer = new PIXI.autoDetectRenderer(skin.width, skin.height)
    this._renderer.render(this.stage)
    this.view = this._renderer.view
  }
}

export default Context
