
// !! avoid external dependencies since this is used in boot script!

import Observable from 'bemuse/observable'

export class Progress {
  constructor() {
    this.current      = undefined
    this.total        = undefined
    this.extra        = undefined
    this._observable  = new Observable()
  }
  report(current, total, extra) {
    this.current  = current
    this.total    = total
    this.extra    = extra
    this._observable.notify()
  }
  watch(f) {
    f(this)
    return this._observable.watch(() => f(this))
  }
  get progress() {
    if (this.total && this.current !== undefined && this.current !== null) {
      return this.current / this.total
    } else {
      return null
    }
  }
}

export default Progress

