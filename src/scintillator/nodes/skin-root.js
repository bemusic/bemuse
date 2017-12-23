
import * as PIXI from 'pixi.js'

import SkinNode from './lib/base'
import Instance from './lib/instance'

export class SkinRootNode extends SkinNode {
  compile (compiler, $el) {
    this.children = compiler.compileChildren($el)
    this.width = +$el.attr('width')
    this.height = +$el.attr('height')
  }
  instantiate (context) {
    let stage = new PIXI.Stage(0x090807)
    return new Instance({
      context: context,
      object: stage,
      children: this.children
    })
  }
}

export default SkinRootNode
