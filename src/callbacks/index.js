
// !! avoid external dependencies since this is used in boot script!

export class Callbacks {
  constructor(init) {
    this._callbacks = { }
    this._nextId = 1
    if (typeof init === 'function') {
      this.add(init)
    } else if (typeof init === 'object' && init && init.length) {
      for (var i = 0; i < init.length; i++) this.add(init[i])
    }
  }
  call() {
    var callbacks = this._callbacks
    for (var id in callbacks) {
      callbacks[id].apply(null, arguments)
    }
  }
  add(callback) {
    var id = this._nextId++
    this._callbacks[id] = callback
    return () => delete this._callbacks[id]
  }
}

export default Callbacks
