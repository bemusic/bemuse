/**
 * A SkinNode is an internal representation of a Skin.
 *
 * Node.compile     :: (compiler, $xml) -> Node
 *
 * To implement:
 *
 * Node#compile     :: (compiler, $xml) -> undefined (side-effect)
 * Node#instantiate :: (instantiator)   -> PIXI.DisplayObject
 */
export class SkinNode {
  static compile (compiler, $el) {
    let node = new this()
    node.compile(compiler, $el)
    return node
  }
}

export default SkinNode
