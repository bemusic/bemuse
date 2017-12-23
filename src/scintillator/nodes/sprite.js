
import * as PIXI from 'pixi.js'

import SkinNode from './lib/base'
import Instance from './lib/instance'
import { parseFrame } from './lib/utils'

import DisplayObject from './concerns/display-object'

export class SpriteNode extends SkinNode {
  compile (compiler, $el) {
    this.url = compiler.resources.get($el.attr('image'))
    this.display = DisplayObject.compile(compiler, $el)
    this.frame = parseFrame($el.attr('frame') || '')
  }
  instantiate (context, container) {
    let sprite = new PIXI.Sprite(this.getTexture())
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
