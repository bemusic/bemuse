
import * as PIXI from 'pixi.js'

import SkinNode from './lib/base'
import Instance from './lib/instance'

import DisplayObject from './concerns/display-object'
import { parseFrame } from './lib/utils'

export class Mask {
  constructor (frame) {
    this._frame = frame
  }
  instantiate (context, subject) {
    let mask = new PIXI.Graphics()
    mask.beginFill()
    mask.drawShape(this._frame)
    mask.endFill()
    subject.object.mask = mask
    return new Instance({
      context: context,
      object: mask,
      parent: subject.object
    })
  }
}

export class GroupNode extends SkinNode {
  compile (compiler, $el) {
    this.children = compiler.compileChildren($el)
    this.display = DisplayObject.compile(compiler, $el)
    let maskFrame = parseFrame($el.attr('mask') || '')
    if (maskFrame) this.mask = new Mask(maskFrame)
  }
  instantiate (context, container) {
    let object = new PIXI.Container()
    let concerns = [ this.display ]
    if (this.mask) {
      concerns.push(this.mask)
    }
    return new Instance({
      context: context,
      object: object,
      parent: container,
      concerns: concerns,
      children: this.children
    })
  }
}

export default GroupNode
