
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
  }
  instantiate(context, container) {
    let text = new PIXI.BitmapText(this.text, { font: this.font })
    return new Instance({
      context:  context,
      parent:   container,
      object:   text,
      concerns: [this.display],
      bindings: [
        [this.data, v => text.setText(this.text.replace('%s', v))],
      ],
    })
  }
}

export default TextNode

