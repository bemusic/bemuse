
import SkinNode from '../lib/base'
import Instance from '../lib/instance'

export class DisplayObject extends SkinNode {
  compile(compiler, $el) {
    this.x = +$el.attr('x') || 0
    this.y = +$el.attr('y') || 0
    this.blendMode = $el.attr('blend') || 'normal'
  }
  instantiate(context, object) {
    return new Instance(context, self => {
      object.x = this.x
      object.y = this.y
      object.blendMode = parseBlendMode(context.PIXI, this.blendMode)
      void self
    })
  }
}

function parseBlendMode(PIXI, text) {
  if (text === 'normal') return PIXI.blendModes.NORMAL
  if (text === 'screen') return PIXI.blendModes.SCREEN
  throw new Error('Invalid blend mode: ' + text)
}

export default DisplayObject
