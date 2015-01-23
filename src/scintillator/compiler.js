
import $ from 'jquery'

import Debug from 'debug/browser'
let debug = Debug('scintillator:compiler')

import { SkinRootNode, SpriteNode, GroupNode, ObjectNode } from './nodes'

/**
 * A Compiler compiles the $xml theme file into SkinNode.
 */
class Compiler {
  constructor($xml) {
    this._$xml = $xml
    this._NODE_MAPPING = {
      'sprite': SpriteNode,
      'object': ObjectNode,
      'group':  GroupNode,
    }
  }
  compile() {
    return this._compile(SkinRootNode, this._$xml)
  }
  _compile(Node, $element) {
    debug('compiling', $element[0])
    let compile = ($el, node) => this._compileContainer($el, node)
    return Node.fromXML($element, compile)
  }
  _compileContainer($element, node) {
    for (let child of Array.from($element.children())) {
      this._compileChild($(child), node)
    }
    return node
  }
  _compileChild($child, container) {
    let Node = this._NODE_MAPPING[$child[0].nodeName.toLowerCase()]
    if (!Node) return
    container.addChild(this._compile(Node, $child))
  }
}

export default Compiler

