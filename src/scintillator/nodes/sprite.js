
import SkinNode       from './lib/base'
import Instance       from './lib/instance'

import DisplayObject  from './concerns/display-object'

export class SpriteNode extends SkinNode {
  compile(compiler, $el) {
    this.url      = compiler.resources.get($el.attr('image'))
    this.display  = DisplayObject.compile(compiler, $el)
  }
  instantiate(context, container) {
    return new Instance(context, self => {
      let texture = context.PIXI.Texture.fromFrame(this.url)
      let sprite  = new context.PIXI.Sprite(texture)
      self.child(this.display, sprite)
      container.addChild(sprite)
      self.onDestroy(() => { container.removeChild(sprite) })
    })
  }
}

export default SpriteNode
