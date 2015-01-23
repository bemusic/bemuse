
import SkinNode from './base'

export class DisplayObjectNode extends SkinNode {
  compile(compiler, $el) {
    this.x = +$el.attr('x') || 0
    this.y = +$el.attr('y') || 0
    this.blendMode = $el.attr('blend') || 'normal'
  }
  instantiate(instance, sprite) {
    sprite.x = this.x
    sprite.y = this.y
    sprite.blendMode = parseBlendMode(instance.PIXI, this.blendMode)
  }
}

function parseBlendMode(PIXI, text) {
  if (text === 'normal') return PIXI.blendModes.NORMAL
  if (text === 'screen') return PIXI.blendModes.SCREEN
  throw new Error('Invalid blend mode: ' + text)
}

export default DisplayObjectNode
