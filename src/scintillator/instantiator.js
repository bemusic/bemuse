
import promiseForPixi from './pixi'
import co from 'co'

export function instantiate(skin, options) {
  return co(function*() {
    let PIXI          = yield promiseForPixi
    let instantiator  = new Instantiator({ PIXI, options })
    let instance      = instantiator.instantiate(skin)
    return instance
  })
}

class BaseSkinNodeInstance {
  constructor(instantiator) {
    this._instantiator = instantiator
  }
  instantiate(node, ...args) {
    return this._instantiator.instantiate(node, ...args)
  }
}

class Instantiator {
  constructor(env) {
    function SkinNodeInstance() {
      BaseSkinNodeInstance.apply(this, arguments)
    }
    SkinNodeInstance.prototype = Object.create(BaseSkinNodeInstance.prototype)
    Object.assign(SkinNodeInstance.prototype, env)
    this._SkinNodeInstance = SkinNodeInstance
  }
  instantiate(node, ...args) {
    let SkinNodeInstance = this._SkinNodeInstance
    let instance = new SkinNodeInstance(this)
    node.instantiate(instance, ...args)
    return instance
  }
}

