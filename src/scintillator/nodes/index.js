
import SkinNode from './base'

class DisplayObjectNode extends SkinNode {
  compile(compiler, $el) {
    this.x = +$el.attr('x') || 0
    this.y = +$el.attr('y') || 0
  }
  instantiate(instance, sprite) {
    sprite.x = this.x
    sprite.y = this.y
  }
}

export class SpriteNode extends SkinNode {
  compile(compiler, $el) {
    super(compiler, $el)
    this.url      = compiler.resources.get($el.attr('image'))
    this.display  = DisplayObjectNode.compile(compiler, $el)
  }
  instantiate(instance) {
    let sprite = instance.PIXI.Sprite.fromImage(this.url)
    instance.instantiate(this.display, sprite)
    return sprite
  }
}

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

export class SkinRootNode extends ContainerNode {
  compile(compiler, $el) {
    super(compiler, $el)
    this.width  = +$el.attr('width')
    this.height = +$el.attr('height')
  }
  instantiate(instance) {
    let stage = new instance.PIXI.Stage(0x090807)
    this.instantiateChildren(instance, stage)
    return stage
  }
}

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

export class ObjectNode extends ContainerNode {
  instantiate(instance) {
    let container = new instance.PIXI.DisplayObjectContainer()
    return container
  }
}

