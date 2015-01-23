
import ContainerNode      from './lib/container'

export class SkinRootNode extends ContainerNode {
  compile(compiler, $el) {
    super(compiler, $el)
    this.width  = +$el.attr('width')
    this.height = +$el.attr('height')
  }
  instantiate(instance) {
    let stage = new instance.PIXI.Stage(0x090807)
    this.instantiateChildren(instance, stage)
    instance.stage = stage
  }
}

export default SkinRootNode
