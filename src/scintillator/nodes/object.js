
import PIXI           from 'pixi.js'

import SkinNode       from './lib/base'
import Instance       from './lib/instance'
import Expression     from '../expression'

import DisplayObject  from './concerns/display-object'

class ChildManager {
  constructor() {
    this._instances = new Map()
  }
  push(array) {
    let unused = new Set(this._instances.keys())
    for (let item of array) {
      let key = item.key
      let instance
      if (this._instances.has(key)) {
        instance = this._instances.get(key)
      } else {
        instance = this.createInstance()
        this._instances.set(key, instance)
      }
      instance.push(item)
      unused.delete(key)
    }
    for (let key of unused) {
      let instance = this._instances.get(key)
      instance.destroy()
      this._instances.delete(key)
    }
  }
}

function multi(instances) {
  if (instances.length === 1) {
    return instances[0]
  }
  return {
    destroy() {
      for (let instance of instances) instance.destroy()
    },
    push(value) {
      for (let instance of instances) instance.push(value)
    },
  }
}

export class ObjectNode extends SkinNode {
  compile(compiler, $el) {
    this.children = compiler.compileChildren($el)
    this.display  = DisplayObject.compile(compiler, $el)
    this.key      = new Expression($el.attr('key'))
  }
  instantiate(context, container) {
    return new Instance(context, self => {
      let object = new PIXI.SpriteBatch()
      self.child(this.display, object)
      container.addChild(object)
      self.onDestroy(() => { container.removeChild(object) })
      let manager = new ChildManager()
      manager.createInstance = () =>
        multi(this.children.map(c => c.instantiate(context, object)))
      self.bind(this.key, array => manager.push(array))
    })
  }
}

export default ObjectNode
