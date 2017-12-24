
import * as PIXI from 'pixi.js'

import SkinNode from './lib/base'
import Instance from './lib/instance'
import DisplayObject from './concerns/display-object'
import Expression from '../expression'

export class TextNode extends SkinNode {
  compile (compiler, $el) {
    this.font = $el.attr('font')
    this.text = $el.attr('text')
    this.data = new Expression($el.attr('data') || '0')
    this.display = DisplayObject.compile(compiler, $el)
    this.ttf = !$el.attr('font-src')
    this.fill = $el.attr('fill')
    this.align = (
      $el.attr('align') === 'left'
        ? 0
        : $el.attr('align') === 'right'
          ? 1
          : 0.5
    )
  }
  instantiate (context, container) {
    let text
    if (this.ttf) {
      text = new PIXI.Text(this.text, {
        font: this.font,
        fill: this.fill
      })
    } else {
      text = new PIXI.extras.BitmapText(this.text, { font: this.font })
    }
    let object = new PIXI.Container()
    object.addChild(text)
    return new Instance({
      context: context,
      parent: container,
      object: object,
      concerns: [this.display],
      bindings: [
        [
          this.data,
          v => {
            text.text = this.text.replace('%s', v)
            text.updateText()
            text.x = text.width * -this.align
          }
        ]
      ]
    })
  }
}

export default TextNode
