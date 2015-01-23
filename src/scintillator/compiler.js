
import $ from 'jquery'

import Debug from 'debug/browser'
let debug = Debug('scintillator:compiler')

import { SkinRootNode, SpriteNode, GroupNode, ObjectNode } from './nodes'

/**
 * A Compiler compiles the $xml theme file into SkinNode.
 */
class Compiler {
  constructor(env) {
    Object.assign(this, env)
  }
  compile($el) {
    let nodeName = $el[0].nodeName
    debug('compiling', $el[0])
    let Node = Compiler.getNodeClass(nodeName)
    if (!Node) throw new Error('Invalid node name: ' + nodeName)
    return Node.compile(this, $el)
  }
  compileChildren($el) {
    let output = []
    for (let child of Array.from($el.children())) {
      let nodeName = child.nodeName
      let Node = Compiler.getNodeClass(nodeName)
      if (Node) output.push(this.compile($(child)))
    }
    return output
  }

  static register(object) {
    Object.assign(this._registry, object)
  }
  static getNodeClass(nodeName) {
    return this._registry[nodeName]
  }
}

Compiler._registry = { }

Compiler.register({
  'skin':   SkinRootNode,
  'sprite': SpriteNode,
  'object': ObjectNode,
  'group':  GroupNode,
})

export default Compiler

