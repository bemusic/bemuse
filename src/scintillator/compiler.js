
import debug from 'debug/browser'
let log = debug('scintillator:compiler')

import $ from 'jquery'

import SkinRootNode from './nodes/skin-root'
import SpriteNode   from './nodes/sprite'
import GroupNode    from './nodes/group'
import ObjectNode   from './nodes/object'
import TextNode     from './nodes/text'

let NODES = {
  'skin':   SkinRootNode,
  'sprite': SpriteNode,
  'group':  GroupNode,
  'object': ObjectNode,
  'text':   TextNode,
}


/**
 * A Compiler compiles the $xml theme file into SkinNode.
 */
class Compiler {
  constructor(env) {
    Object.assign(this, env)
  }
  compile($el) {
    let nodeName = $el[0].nodeName
    log('compiling', $el[0])
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

  static getNodeClass(nodeName) {
    return NODES[nodeName]
  }
}

export default Compiler

