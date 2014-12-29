
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
}
