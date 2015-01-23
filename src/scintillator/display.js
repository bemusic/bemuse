
import promiseForPixi from './pixi'
import co from 'co'

class Display {
  constructor(renderer) {
    this._renderer = renderer
    this.view = renderer.view
  }
  render(instance, data) {
    this._renderer.render(instance.stage)
    void data
  }
}

export function create(w, h) {
  return co(function*() {
    let PIXI = yield promiseForPixi
    let renderer = new PIXI.autoDetectRenderer(w, h)
    return new Display(renderer)
  })
}
