
import PIXI     from 'pixi.js'

import SkinNode from '../lib/base'
import Instance from '../lib/instance'

import Expression from '../../expression'
import Animation  from './animation'

// Numeric properties that may be interpreted as expressions.
let properties = [
  { name: 'x',       default: '0', apply: (obj, v) => obj.x = v },
  { name: 'y',       default: '0', apply: (obj, v) => obj.y = v },
  { name: 'scale-x', default: '1', apply: (obj, v) => obj.scale.x = v },
  { name: 'scale-y', default: '1', apply: (obj, v) => obj.scale.y = v },
  { name: 'alpha',   default: '1', apply: (obj, v) => obj.alpha = v },
  { name: 'width',                 apply: (obj, v) => obj.width = v},
  { name: 'height',                apply: (obj, v) => obj.height = v },
  { name: 'visible',               apply: (obj, v) => obj.visible = v },
]

export class DisplayObject extends SkinNode {
  compile(compiler, $el) {
    this._animation  = Animation.compile(compiler, $el)
    this._properties = properties.map(property => {
      let value = $el.attr(property.name)
      if (!property.default && !value) {
        return () => {}
      } else {
        let expression = new Expression(value || property.default)
        return (self, object) => {
          self.bind(this._animation.prop(property.name, expression),
              value => property.apply(object, value))
        }
      }
    })
    this.blendMode = parseBlendMode($el.attr('blend') || 'normal')
  }
  instantiate(context, object) {
    return new Instance(context, self => {
      for (let instantiateProperty of this._properties) {
        instantiateProperty(self, object)
      }
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
