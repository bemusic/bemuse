
import PIXI           from 'pixi.js'

import SkinNode       from './lib/base'
import Instance       from './lib/instance'

import DisplayObject  from './concerns/display-object'
import { parseFrame } from './lib/utils'

export class GroupNode extends SkinNode {
  compile(compiler, $el) {
    this.children = compiler.compileChildren($el)
    this.display  = DisplayObject.compile(compiler, $el)
    this.mask     = parseFrame($el.attr('mask') || '')
  }
  instantiate(context, container) {
    return new Instance(context, self => {
      let object = new PIXI.DisplayObjectContainer()
      self.child(this.display, object)
      self.children(this.children, object)
      if (this.mask) {
        let mask = new PIXI.Graphics()
        mask.beginFill(); mask.drawShape(this.mask); mask.endFill()
        container.addChild(mask)
        object.mask = mask
        self.onDestroy(() => { container.removeChild(mask) })
      }
      container.addChild(object)
      self.onDestroy(() => { container.removeChild(object) })
    })
  }
}

export default GroupNode
