
import PIXI           from 'pixi.js'

import SkinNode       from './lib/base'
import Instance       from './lib/instance'

import DisplayObject  from './concerns/display-object'

export class GroupNode extends SkinNode {
  compile(compiler, $el) {
    this.children = compiler.compileChildren($el)
    this.display  = DisplayObject.compile(compiler, $el)
  }
  instantiate(context, container) {
    return new Instance(context, self => {
      let object = new PIXI.DisplayObjectContainer()
      self.child(this.display, object)
      self.children(this.children, object)
      container.addChild(object)
      self.onDestroy(() => { container.removeChild(object) })
    })
  }
}

export default GroupNode
