
import PIXI           from 'pixi.js'

import SkinNode       from './lib/base'
import Instance       from './lib/instance'

import DisplayObject  from './concerns/display-object'

export class TextNode extends SkinNode {
  compile(compiler, $el) {
    this.font     = $el.attr('font')
    this.text     = $el.attr('text')
    this.display  = DisplayObject.compile(compiler, $el)
  }
  instantiate(context, container) {
    return new Instance(context, self => {
      let text = new PIXI.BitmapText(this.text, { font: this.font })
      self.child(this.display, text)
      container.addChild(text)
      self.onDestroy(() => { container.removeChild(text) })
    })
  }
}

export default TextNode

