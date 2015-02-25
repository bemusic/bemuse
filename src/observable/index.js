
// !! avoid external dependencies since this is used in boot script!

export class Observable {
  constructor(value=undefined) {
    this._observers = { }
    this._nextId = 1
    this._value = value
  }
  get value() {
    return this._value
  }
  set value(value) {
    this._value = value
    this.notify(value)
  }
  notify(value) {
    let observers = this._observers
    for (let id in observers) {
      observers[id](value)
    }
  }
  watch(f) {
    if (this._value !== undefined) f(this._value)
    let id = this._nextId++
    this._observers[id] = f
    return () => delete this._observers[id]
  }
}

export default Observable
