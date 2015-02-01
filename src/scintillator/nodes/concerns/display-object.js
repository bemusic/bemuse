
import PIXI     from 'pixi.js'

import SkinNode from '../lib/base'
import Instance from '../lib/instance'

import Expression from '../../expression'

export class DisplayObject extends SkinNode {
  compile(compiler, $el) {
    this.x = new Expression($el.attr('x') || '0')
    this.y = new Expression($el.attr('y') || '0')
    this.blendMode = $el.attr('blend') || 'normal'
  }
  instantiate(context, object) {
    return new Instance(context, self => {
      self.bind(this.x, x => object.x = x)
      self.bind(this.y, y => object.y = y)
      object.blendMode = parseBlendMode(this.blendMode)
    })
  }
}

function parseBlendMode(text) {
  if (text === 'normal') return PIXI.blendModes.NORMAL
  if (text === 'screen') return PIXI.blendModes.SCREEN
  throw new Error('Invalid blend mode: ' + text)
}

export default DisplayObject
