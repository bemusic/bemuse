
import promiseForPixi from './pixi'
import co from 'co'

export function instantiate(skin, options) {
  return co(function*() {
    let PIXI        = yield promiseForPixi
    let resources   = skin.resources
    let instance    = new SkinInstance()
    let environment = new Environment({ PIXI, options, resources, instance })
    instance.stage  = skin.instantiate(environment)
    return instance
  })
}

class Environment {
  constructor(props) {
    Object.assign(this, props)
  }
  bind(...args) {
    return this.instance.bind(...args)
  }
}

class SkinInstance {
  bind(expression, action) {
    action(expression.evaluate())
  }
}
