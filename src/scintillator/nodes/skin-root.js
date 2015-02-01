
import SkinNode  from './lib/base'
import Instance  from './lib/instance'

export class SkinRootNode extends SkinNode {
  compile(compiler, $el) {
    this.children = compiler.compileChildren($el)
    this.width    = +$el.attr('width')
    this.height   = +$el.attr('height')
  }
  instantiate(context) {
    return new Instance(context, self => {
      let stage = new context.PIXI.Stage(0x090807)
      self.children(this.children, stage)
      context.stage = stage
    })
  }
}

export default SkinRootNode
