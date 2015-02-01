
import promiseForPixi from './pixi'
import co from 'co'

export function instantiate(skin, options) {
  return co(function*() {
    let PIXI     = yield promiseForPixi
    let context  = new Context({ PIXI, options })
    skin.instantiate(context)
    return context
  })
}

class Context {
  constructor(env) {
    Object.assign(this, env)
  }
}

