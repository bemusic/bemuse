
/**
 * A SkinNode is an internal representation of a Skin.
 *
 * Node.compile     :: (compiler, $xml) -> Node
 * Node#compile     :: (compiler, $xml) -> undefined (side-effect)
 * Node#instantiate :: (instantiator)   -> PIXI.DisplayObject
 */
export class SkinNode {
  static compile(compiler, $el) {
    let node = new this()
    node.compile(compiler, $el)
    return node
  }
  compile(compiler, $el) {
    void compiler
    void $el
  }
  instantiate(instance) {
    void instance
  }
}

export default SkinNode
