// !! avoid external dependencies since this is used in boot script!

import Callbacks from 'bemuse/utils/callbacks'

export class Observable<T> {
  private _callbacks = new Callbacks<[T]>()
  private _value?: T
  constructor(value?: T) {
    this._value = value
  }
  get value() {
    return this._value
  }
  set value(value) {
    this._value = value
    this.notify(value!)
  }
  notify(value: T) {
    this._callbacks.call(value)
  }
  watch(f: (value: T) => void) {
    if (this._value !== undefined) f(this._value)
    return this._callbacks.add(f)
  }
}

export default Observable
