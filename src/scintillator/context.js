
import * as PIXI from 'pixi.js'

function createRenderer (w, h) {
  hackPIXIToForceNewBlendModes()

  // For now, we are using CanvasRenderer instead of WebGLRenderer or
  // autoDetectRenderer befcause of two reasons.
  // 1. Current implementation has some problem with rendering
  //    sprite batches: https://github.com/pixijs/pixi.js/issues/1910
  // 2. It seems that Canvas performs better on some browsers, i.e. Chrome.
  //    WebGLRenderer only performs better on Firefox from the experiment.
  return new PIXI.CanvasRenderer(w, h, { transparent: true })
}

// HACK: Sometimes, when using the canvas renderer,
// the blend mode is not properly set.
function hackPIXIToForceNewBlendModes () {
  PIXI.utils.canUseNewCanvasBlendModes = () => true
}

export class Context {
  constructor (skin) {
    this.refs = { }
    this._skin = skin
    this._instance = skin.instantiate(this)
    this._renderer = createRenderer(skin.width, skin.height)
    this.stage = this._instance.object
    this.view = this._renderer.view
    this._setupInteractivity()
  }
  render (data) {
    this._instance.push(data)
    this._renderer.render(this.stage)
  }
  destroy () {
    this._instance.destroy()
    this._instance = null
    this._teardownInteractivity()
  }
  get input () {
    return this._input.get()
  }
  ref (key, object) {
    let set = this.refs[key] || (this.refs[key] = new Set())
    set.add(object)
  }
  unref (key, object) {
    let set = this.refs[key]
    if (!set) return
    set.delete(object)
  }
  _setupInteractivity () {
    let mouse = null
    let touches = [ ]
    let onMouse = (e) => { mouse = e }
    let onUpdateMouse = (e) => { mouse = mouse && e }
    let onNoMouse = () => { mouse = null }
    let onTouch = (e) => { touches = [].slice.call(e.touches) }
    let view = this.view
    let width = this._skin.width
    let height = this._skin.height
    view.addEventListener('mousedown', onMouse, false)
    view.addEventListener('mousemove', onUpdateMouse, false)
    view.addEventListener('mouseup', onNoMouse, false)
    view.addEventListener('touchstart', onTouch, false)
    view.addEventListener('touchmove', onTouch, false)
    view.addEventListener('touchend', onTouch, false)
    this._teardownInteractivity = () => {
      view.removeEventListener('mousedown', onMouse, false)
      view.removeEventListener('mousemove', onUpdateMouse, false)
      view.removeEventListener('mouseup', onNoMouse, false)
      view.removeEventListener('touchstart', onTouch, false)
      view.removeEventListener('touchmove', onTouch, false)
      view.removeEventListener('touchend', onTouch, false)
    }
    this._input = {
      get: () => {
        let output = []
        let rect = this.view.getBoundingClientRect()
        if (mouse) {
          output.push(point('mouse', mouse, rect))
        }
        for (let i = 0; i < touches.length; i++) {
          let touch = touches[i]
          output.push(point('touch' + touch.identifier, touch, rect))
        }
        return output
      }
    }
    function point (id, p, rect) {
      return {
        x: (p.clientX - rect.left) / rect.width * width,
        y: (p.clientY - rect.top) / rect.height * height,
        id: id
      }
    }
  }
}

export default Context
