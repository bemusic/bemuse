
import ContainerNode      from './lib/container'

export class ObjectNode extends ContainerNode {
  instantiate(instance) {
    let container = new instance.PIXI.DisplayObjectContainer()
    return container
  }
}

export default ObjectNode
