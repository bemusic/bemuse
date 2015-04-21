
import Callbacks from 'bemuse/callbacks'

export class State {
  constructor(data) {
    this._data      = Object.assign({ }, data)
    this._callbacks = new Callbacks()
  }
  get() {
    return this._data
  }
  set(data) {
    Object.assign(this._data, data)
    this._callbacks.call(this.get())
  }
  watch(listener) {
    listener(this.get())
    return this._callbacks.add(listener)
  }
}

export default State
