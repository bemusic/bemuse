
import debug from 'debug/browser'
let log = debug('scintillator:compiler')

import $ from 'jquery'

import SkinRootNode from './nodes/skin-root'
import SpriteNode   from './nodes/sprite'
import GroupNode    from './nodes/group'
import ObjectNode   from './nodes/object'
import TextNode     from './nodes/text'
import IfNode       from './nodes/if'

let NODES = {
  'skin':   SkinRootNode,
  'sprite': SpriteNode,
  'group':  GroupNode,
  'object': ObjectNode,
  'text':   TextNode,
  'if':     IfNode,
}


/**
 * A Compiler compiles the $xml theme file into SkinNode.
 */
class Compiler {
  constructor (env) {
    Object.assign(this, env)
    this._defs = new Map()
  }
  compile ($el) {
    let nodeName = $el[0].nodeName
    log('compiling', $el[0])
    let Node = Compiler.getNodeClass(nodeName)
    if (!Node) throw new Error('Invalid node name: ' + nodeName)
    return Node.compile(this, $el)
  }
  compileChildren ($el) {
    let output = []
    for (let child of Array.from($el.children())) {
      let nodeName = child.nodeName
      if (nodeName === 'defs') {
        this.compileDefs($(child))
      } else if (nodeName === 'use') {
        output.push(this.getDef(child.getAttribute('def')))
      } else {
        let Node = Compiler.getNodeClass(nodeName)
        if (Node) output.push(this.compile($(child)))
      }
    }
    return output
  }
  compileDefs ($el) {
    for (let child of Array.from($el.children())) {
      let id = child.getAttribute('id')
      if (!id) throw new Error('A def should have an id: ' + child.nodeName)
      this._defs.set(id, this.compile($(child)))
    }
  }
  getDef (id) {
    let node = this._defs.get(id)
    if (!node) throw new Error('Cannot find def: ' + id)
    return node
  }

  static getNodeClass (nodeName) {
    return NODES[nodeName]
  }
}

export default Compiler
