
import PIXI           from 'pixi.js'

import SkinNode       from './lib/base'
import Instance       from './lib/instance'
import DisplayObject  from './concerns/display-object'
import Expression     from '../expression'

export class TextNode extends SkinNode {
  compile(compiler, $el) {
    this.font     = $el.attr('font')
    this.text     = $el.attr('text')
    this.data     = new Expression($el.attr('data') || '0')
    this.display  = DisplayObject.compile(compiler, $el)
    this.align    = $el.attr('align') === 'center' ? 0.5 : 0
  }
  instantiate(context, container) {
    let text = new PIXI.BitmapText(this.text, { font: this.font })
    let object = new PIXI.DisplayObjectContainer()
    object.addChild(text)
    return new Instance({
      context:  context,
      parent:   container,
      object:   object,
      concerns: [this.display],
      bindings: [
        [
          this.data,
          v => {
            text.setText(this.text.replace('%s', v))
            text.x = text.width * -this.align
          },
        ],
      ],
    })
  }
}

export default TextNode

