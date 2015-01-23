
import ContainerNode      from './lib/container'

export class ObjectNode extends ContainerNode {
  instantiate(instance) {
    let container = new instance.PIXI.DisplayObjectContainer()
    instance.object = container
  }
}

export default ObjectNode
