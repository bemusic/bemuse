
import PIXI     from 'pixi.js'

import SkinNode from '../lib/base'
import Instance from '../lib/instance'

import Expression from '../../expression'

export class DisplayObject extends SkinNode {
  compile(compiler, $el) {
    this.x      = new Expression($el.attr('x') || '0')
    this.y      = new Expression($el.attr('y') || '0')
    this.alpha  = new Expression($el.attr('alpha') || '1')
    if ($el.attr('width'))   this.width   = new Expression($el.attr('width'))
    if ($el.attr('height'))  this.height  = new Expression($el.attr('height'))
    if ($el.attr('visible')) this.visible = new Expression($el.attr('visible'))
    this.blendMode = parseBlendMode($el.attr('blend') || 'normal')
  }
  instantiate(context, object) {
    return new Instance(context, self => {
      self.bind(this.x,     x => object.x = x)
      self.bind(this.y,     y => object.y = y)
      self.bind(this.alpha, a => object.alpha = a)
      if (this.width)   self.bind(this.width,   w => object.width   = w)
      if (this.height)  self.bind(this.height,  h => object.height  = h)
      if (this.visible) self.bind(this.visible, v => object.visible = v)
      object.blendMode = this.blendMode
    })
  }
}

function parseBlendMode(text) {
  if (text === 'normal') return PIXI.blendModes.NORMAL
  if (text === 'screen') return PIXI.blendModes.SCREEN
  throw new Error('Invalid blend mode: ' + text)
}

export default DisplayObject
