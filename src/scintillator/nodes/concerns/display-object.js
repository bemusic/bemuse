
import * as PIXI from 'pixi.js'

import SkinNode from '../lib/base'
import Instance from '../lib/instance'

import Expression from '../../expression'
import Animation from './animation'

// Numeric properties that may be interpreted as expressions.
let properties = [
  { name: 'x', default: '0', apply: (obj, v) => (obj.x = v) },
  { name: 'y', default: '0', apply: (obj, v) => (obj.y = v) },
  { name: 'scale-x', default: '1', apply: (obj, v) => (obj.scale.x = v) },
  { name: 'scale-y', default: '1', apply: (obj, v) => (obj.scale.y = v) },
  { name: 'alpha', default: '1', apply: (obj, v) => (obj.alpha = v) },
  { name: 'width', apply: (obj, v) => (obj.width = v) },
  { name: 'height', apply: (obj, v) => (obj.height = v) },
  { name: 'visible', apply: (obj, v) => (obj.visible = v) }
]

export class DisplayObject extends SkinNode {
  compile (compiler, $el) {
    this._animation = Animation.compile(compiler, $el)
    this._bindings = [ ]
    for (let property of properties) {
      let code = $el.attr(property.name) || property.default
      if (!code) continue
      let expression = new Expression(code)
      let getter = this._animation.prop(property.name, expression)
      this._bindings.push({
        getter: getter,
        apply: property.apply
      })
    }
    this.blendMode = parseBlendMode($el.attr('blend') || 'normal')
    this.ref = $el.attr('ref') || null
  }
  instantiate (context, subject) {
    var object = subject.object
    var bindings = [ ]
    var onDestroy = null
    object.blendMode = this.blendMode
    for (var i = 0; i < this._bindings.length; i++) {
      var binding = this._bindings[i]
      bindings.push([ binding.getter, binding.apply.bind(null, object) ])
    }
    if (this.ref) {
      context.ref(this.ref, object)
      onDestroy = () => context.unref(this.ref, object)
    }
    return new Instance({
      bindings: bindings,
      onDestroy: onDestroy
    })
  }
}

function parseBlendMode (text) {
  if (text === 'normal') return PIXI.BLEND_MODES.NORMAL
  if (text === 'screen') return PIXI.BLEND_MODES.SCREEN
  throw new Error('Invalid blend mode: ' + text)
}

export default DisplayObject
