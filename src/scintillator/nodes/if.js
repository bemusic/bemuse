
import * as PIXI      from 'pixi.js'

import SkinNode       from './lib/base'
import Instance       from './lib/instance'
import Expression     from '../expression'

export class IfNode extends SkinNode {
  compile (compiler, $el) {
    let children = compiler.compileChildren($el)
    if (children.length !== 1) {
      throw new Error('Expected exactly 1 children, ' +
        children.length + ' found')
    }
    this.child    = children[0]
    this.key      = new Expression($el.attr('key'))
    this.value    = String($el.attr('value'))
  }
  instantiate (context, container) {
    let object    = new PIXI.Container()
    let expr      = this.key
    let value     = this.value
    let childNode = this.child
    let child     = null
    return new Instance({
      context:  context,
      parent:   container,
      object:   object,
      onData: (data) => {
        if (String(expr(data)) === value) {
          if (child === null) {
            child = childNode.instantiate(context, object)
          }
          child.push(data)
        } else {
          if (child !== null) {
            child.destroy()
            child = null
          }
        }
      },
    })
  }
}

export default IfNode

