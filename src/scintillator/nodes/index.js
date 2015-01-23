
export class SkinNode {
  static fromXML($element) {
    let ThisClass = this
    let node = new ThisClass()
    void $element
    return node
  }
}

export class SpriteNode extends SkinNode {
  static fromXML($element, compile) {
    let node = super($element, compile)
    node.image = $element.attr('image')
    return node
  }
}

export class ContainerNode extends SkinNode {
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

export class SkinRootNode extends ContainerNode {
}

export class GroupNode extends ContainerNode {
}

export class ObjectNode extends ContainerNode {
}

