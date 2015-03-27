
// !! avoid external dependencies since this is used in boot script!

import Callbacks from 'bemuse/callbacks'

export class Observable {
  constructor(value=undefined) {
    this._callbacks = new Callbacks()
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
    this._callbacks.call(value)
  }
  watch(f) {
    if (this._value !== undefined) f(this._value)
    return this._callbacks.add(f)
  }
}

export default Observable
