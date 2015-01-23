
import SkinNode from './base'

export class ContainerNode extends SkinNode {
  compile(compiler, $el) {
    this.children = compiler.compileChildren($el)
  }
  instantiateChildren(instance, displayObject) {
    for (let child of this.children) {
      let childInstance = instance.instantiate(child)
      displayObject.addChild(childInstance.object)
    }
  }
}

export default ContainerNode
