import * as PIXI from 'pixi.js'

import DisplayObject from './concerns/display-object'
import Instance from './lib/instance'
import SkinNode from './lib/base'
import { parseFrame } from './lib/utils'

export class SpriteNode extends SkinNode {
  compile (compiler, $el) {
    this.url = compiler.resources.get($el.attr('image'))
    this.display = DisplayObject.compile(compiler, $el)
    this.frame = parseFrame($el.attr('frame') || '')
    this.anchorX = +$el.attr('anchor-x') || 0
    this.anchorY = +$el.attr('anchor-y') || 0
  }
  instantiate (context, container) {
    let sprite = new PIXI.Sprite(this.getTexture())
    sprite.anchor.x = this.anchorX
    sprite.anchor.y = this.anchorY
    return new Instance({
      context: context,
      object: sprite,
      parent: container,
      concerns: [this.display]
    })
  }
  getTexture () {
    if (this._texture) return this._texture
    let scaleMode = PIXI.SCALE_MODES.NEAREST
    let base = PIXI.BaseTexture.fromImage(this.url, undefined, scaleMode)
    let texture = new PIXI.Texture(base, this.frame)
    this._texture = texture
    return texture
  }
}

export default SpriteNode
