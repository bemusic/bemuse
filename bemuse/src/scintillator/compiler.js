import $ from 'jquery'
import debug from 'debug'

import GroupNode from './nodes/group'
import IfNode from './nodes/if'
import ObjectNode from './nodes/object'
import SkinRootNode from './nodes/skin-root'
import SpriteNode from './nodes/sprite'
import TextNode from './nodes/text'

const log = debug('scintillator:compiler')

const NODES = {
  skin: SkinRootNode,
  sprite: SpriteNode,
  group: GroupNode,
  object: ObjectNode,
  text: TextNode,
  if: IfNode,
}

/**
 * A Compiler compiles the $xml theme file into SkinNode.
 */
class Compiler {
  constructor(env) {
    Object.assign(this, env)
    this._defs = new Map()
  }

  compile($el) {
    const nodeName = $el[0].nodeName
    log('compiling', $el[0])
    const Node = Compiler.getNodeClass(nodeName)
    if (!Node) throw new Error('Invalid node name: ' + nodeName)
    return Node.compile(this, $el)
  }

  compileChildren($el) {
    const output = []
    for (const child of Array.from($el.children())) {
      const nodeName = child.nodeName
      if (nodeName === 'defs') {
        this.compileDefs($(child))
      } else if (nodeName === 'use') {
        output.push(this.getDef(child.getAttribute('def')))
      } else {
        const Node = Compiler.getNodeClass(nodeName)
        if (Node) output.push(this.compile($(child)))
      }
    }
    return output
  }

  compileDefs($el) {
    for (const child of Array.from($el.children())) {
      const id = child.getAttribute('id')
      if (!id) throw new Error('A def should have an id: ' + child.nodeName)
      this._defs.set(id, this.compile($(child)))
    }
  }

  getDef(id) {
    const node = this._defs.get(id)
    if (!node) throw new Error('Cannot find def: ' + id)
    return node
  }

  static getNodeClass(nodeName) {
    return NODES[nodeName]
  }
}

export default Compiler
