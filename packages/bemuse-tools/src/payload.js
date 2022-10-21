import { createHash } from 'crypto'

export class Payload {
  constructor() {
    this.buffers = []
    this.size = 0
  }

  add(buffer) {
    const result = [this.size, this.size + buffer.length]
    this.buffers.push(buffer)
    this.size += buffer.length
    return result
  }

  get hash() {
    const hash = createHash('md5')
    for (const buffer of this.buffers) {
      hash.update(buffer)
    }
    return hash.digest('hex')
  }
}

export default Payload
