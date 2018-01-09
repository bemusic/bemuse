import * as PIXI from 'pixi.js'

import Instance from './lib/instance'
import SkinNode from './lib/base'

export class SkinRootNode extends SkinNode {
  compile (compiler, $el) {
    this.children = compiler.compileChildren($el)
    this.width = +$el.attr('width')
    this.height = +$el.attr('height')
    this.data = $el.data()
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
