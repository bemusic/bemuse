
import SkinNode from './base'

export class DisplayObjectNode extends SkinNode {
  compile(compiler, $el) {
    this.x = +$el.attr('x') || 0
    this.y = +$el.attr('y') || 0
  }
  instantiate(instance, sprite) {
    sprite.x = this.x
    sprite.y = this.y
  }
}

export default DisplayObjectNode
