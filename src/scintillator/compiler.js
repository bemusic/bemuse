
import $ from 'jquery'

import Debug from 'debug/browser'
let debug = Debug('scintillator:compiler')

/**
 * A Compiler compiles the $xml theme file into SkinNode.
 */
class Compiler {
  constructor({ $xml }) {
    this._$xml = $xml
    this._NODE_MAPPING = {
      'sprite': SpriteNode,
      'object': ObjectNode,
      'group':  GroupNode,
    }
  }
  compile() {
    return this._compile(RootNode, this._$xml)
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

class SkinNode {
  static fromXML($element) {
    let ThisClass = this
    let node = new ThisClass()
    void $element
    return node
  }
}

class SpriteNode extends SkinNode {
}

class ContainerNode extends SkinNode {
  constructor() {
    this.children = []
  }
  addChild(node) {
    this.children.push(node)
  }
  static fromXML($element, compile) {
    let node = super($element, compile)
    compile($element, node)
    return node
  }
}

class RootNode extends ContainerNode {
}

class GroupNode extends ContainerNode {
}

class ObjectNode extends ContainerNode {
}

export default Compiler

