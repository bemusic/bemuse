
import Debug from 'debug/browser'
let debug = Debug('scintillator:nodes')

export class SkinNode {
  static fromXML($element) {
    let ThisClass = this
    let node = new ThisClass()
    void $element
    return node
  }
}

export class SpriteNode extends SkinNode {
  instantiate(env) {
    let url = env.resources.get(this.image)
    debug('instantiate sprite', url)
    let sprite = env.PIXI.Sprite.fromImage(url)
    sprite.x = this.x || 0
    sprite.y = this.y || 0
    return sprite
  }
  static fromXML($element, compile) {
    let node = super($element, compile)
    node.image = $element.attr('image')
    node.x = +$element.attr('x')
    node.y = +$element.attr('y')
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
  instantiateChildren(env, object) {
    for (let child of this.children) {
      debug('instantiateChildren', child)
      let result = child.instantiate(env)
      debug('instantiateChildren result', result)
      object.addChild(result)
      debug('instantiateChildren done', child)
    }
  }
  static fromXML($element, compile) {
    let node = super($element, compile)
    compile($element, node)
    return node
  }
}

export class SkinRootNode extends ContainerNode {
  instantiate(env) {
    let stage = new env.PIXI.Stage(0x090807)
    this.instantiateChildren(env, stage)
    return stage
  }
  static fromXML($element, compile) {
    let node = super($element, compile)
    node.width  = +$element.attr('width')
    node.height = +$element.attr('height')
    return node
  }
}

export class GroupNode extends ContainerNode {
  instantiate(env) {
    let container = new env.PIXI.DisplayObjectContainer()
    this.instantiateChildren(env, container)
    return container
  }
}

export class ObjectNode extends ContainerNode {
  instantiate(env) {
    let container = new env.PIXI.DisplayObjectContainer()
    return container
  }
}

