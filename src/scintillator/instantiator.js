
import promiseForPixi from './pixi'
import co from 'co'

export function instantiate(skin, options) {
  return co(function*() {
    let PIXI        = yield promiseForPixi
    let resources   = skin.resources
    let instance    = new SkinInstance()
    let environment = { PIXI, options, resources, instance }
    instance.stage  = skin.instantiate(environment)
    return instance
  })
}

class SkinInstance {
}
