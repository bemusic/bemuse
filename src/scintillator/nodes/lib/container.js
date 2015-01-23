
import SkinNode from './base'

export class ContainerNode extends SkinNode {
  compile(compiler, $el) {
    this.children = compiler.compileChildren($el)
  }
  instantiateChildren(instance, displayObject) {
    for (let child of this.children) {
      let childDisplayObject = instance.instantiate(child)
      displayObject.addChild(childDisplayObject)
    }
  }
}

export default ContainerNode
