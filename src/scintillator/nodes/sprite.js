
import SkinNode           from './lib/base'
import DisplayObjectNode  from './lib/display-object'

export class SpriteNode extends SkinNode {
  compile(compiler, $el) {
    super(compiler, $el)
    this.url      = compiler.resources.get($el.attr('image'))
    this.display  = DisplayObjectNode.compile(compiler, $el)
  }
  instantiate(instance) {
    let texture = instance.PIXI.Texture.fromFrame(this.url)
    let sprite  = new instance.PIXI.Sprite(texture)
    instance.instantiate(this.display, sprite)
    return sprite
  }
}

export default SpriteNode
