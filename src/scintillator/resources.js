
import R from 'ramda'

/**
 * The resources class contains a mapping from an image "src" to the resolved
 * image "url."
 */
export class Resources {
  constructor() {
    this._map = { }
  }
  add(src, url) {
    this._map[src] = url
  }
  get urls() {
    return R.values(this._map)
  }
}

export default Resources
