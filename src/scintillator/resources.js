
import _ from 'lodash'

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
  get(src) {
    if (!(src in this._map)) throw new Error('Not registered: ' + src)
    return this._map[src]
  }
  get urls() {
    return _.values(this._map)
  }
}

export default Resources
