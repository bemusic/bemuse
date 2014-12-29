
import { createHash } from 'crypto'

export default class Payload {
  constructor() {
    this._buffers = []
    this.size = 0
  }
  add(buffer) {
    let result = [this.size, this.size + buffer.length]
    this._buffers.push(buffer)
    this.size += buffer.length
    return result
  }
  get hash() {
    let hash = createHash('sha1')
    for (let buffer of this._buffers) {
      hash.update(buffer)
    }
    return hash.digest('hex')
  }
}
