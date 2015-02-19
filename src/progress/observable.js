
export class Observable {
  constructor() {
    this._observers = { }
    this._nextId = 1
  }
  notify(value) {
    let observers = this._observers
    for (let id in observers) {
      observers[id](value)
    }
  }
  watch(f) {
    let id = this._nextId++
    this._observers[id] = f
    return () => delete this._observers[id]
  }
}

export default Observable
