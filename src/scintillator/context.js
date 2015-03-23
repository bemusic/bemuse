
import PIXI from 'pixi.js'

export class Context {
  constructor(skin) {
    this.refs       = { }
    this._skin      = skin
    this._instance  = skin.instantiate(this)
    this._renderer  = new PIXI.autoDetectRenderer(skin.width, skin.height)
    this.stage      = this._instance.object
    this.view       = this._renderer.view
    this._setupInteractivity()
  }
  render(data) {
    this._instance.push(data)
    this._renderer.render(this.stage)
  }
  destroy() {
    this._instance.destroy()
    this._instance = null
  }
  get input() {
    return this._input.get()
  }
  ref(key, object) {
    let set = this.refs[key] || (this.refs[key] = new Set())
    set.add(object)
  }
  unref(key, object) {
    let set = this.refs[key]
    if (!set) return
    set.delete(object)
  }
  _setupInteractivity() {
    let stage = this.stage
    let im    = stage.interactionManager
    let mouseDown = false
    stage.interactive = true
    stage.mousedown       = () => { mouseDown = true }
    stage.mouseup         = () => { mouseDown = false }
    stage.mouseupoutside  = () => { mouseDown = false }
    this._input = {
      get: () => {
        let output = []
        if (mouseDown) {
          let mouse = im.mouse.global
          output.push({ x: mouse.x, y: mouse.y, id: 'mouse' })
        }
        for (let key in im.touches) {
          if (im.touches[key]) {
            let touch = im.touches[key].global
            output.push({ x: touch.x, y: touch.y, id: `touch${key}` })
          }
        }
        return output
      }
    }
  }
}

export default Context
