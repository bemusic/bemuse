
import { createHash } from 'crypto'

export class Payload {
  constructor () {
    this.buffers = []
    this.size = 0
  }
  add (buffer) {
    let result = [this.size, this.size + buffer.length]
    this.buffers.push(buffer)
    this.size += buffer.length
    return result
  }
  get hash () {
    let hash = createHash('md5')
    for (let buffer of this.buffers) {
      hash.update(buffer)
    }
    return hash.digest('hex')
  }
}

export default Payload
