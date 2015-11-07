
import PIXI           from 'pixi.js'

import SkinNode       from './lib/base'
import Instance       from './lib/instance'
import Expression     from '../expression'

function ChildManager (expr, child, poolSize) {
  return {
    instantiate (context, subject) {
      let instances = new Map()
      let pool      = []
      initPool()
      return new Instance({
        context:  context,
        onData:   (data) => {
          update(expr(data))
        },
      })
      function initPool () {
        var instance
        console.log('init i' + poolSize)
        for (var i = 0; i < poolSize; i++) {
          instance = child.instantiate(context, subject.object)
          instance.detach()
          pool.push(instance)
        }
      }
      function update (array) {
        var unused = new Set(instances.keys())
        var key
        var item
        var instance
        if (!array) array = []
        for (var i = 0; i < array.length; i++) {
          item  = array[i]
          key = item.key
          if (instances.has(key)) {
            instance = instances.get(key)
          } else {
            instance = createInstance()
            instances.set(key, instance)
          }
          instance.push(item)
          unused.delete(key)
        }
        for (key of unused) {
          instance = instances.get(key)
          instance.detach()
          instances.delete(key)
          pool.push(instance)
        }
      }
      function createInstance () {
        var instance = pool.pop()
        if (instance) {
          instance.attachTo(subject.object)
        } else {
          instance = child.instantiate(context, subject.object)
        }
        return instance
      }
    }
  }
}

export class ObjectNode extends SkinNode {
  compile (compiler, $el) {
    this.children = compiler.compileChildren($el)
    if (this.children.length !== 1) {
      throw new Error('Expected exactly 1 children, ' +
        this.children.length + ' given')
    }
    this.pool     = +$el.attr('pool') || 1
    this.key      = new Expression($el.attr('key'))
  }
  instantiate (context, container) {
    let batch = new PIXI.ParticleContainer(null, {
      position: true,
      alpha:    true,
    })
    let manager = new ChildManager(this.key, this.children[0], this.pool)
    return new Instance({
      context:  context,
      parent:   container,
      object:   batch,
      concerns: [manager],
    })
  }
}

export default ObjectNode
