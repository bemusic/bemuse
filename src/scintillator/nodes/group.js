
import ContainerNode      from './lib/container'
import DisplayObjectNode  from './lib/display-object'

export class GroupNode extends ContainerNode {
  compile(compiler, $el) {
    super(compiler, $el)
    this.display = DisplayObjectNode.compile(compiler, $el)
  }
  instantiate(instance) {
    let container = new instance.PIXI.DisplayObjectContainer()
    this.instantiateChildren(instance, container)
    instance.instantiate(this.display, container)
    return container
  }
}

export default GroupNode
