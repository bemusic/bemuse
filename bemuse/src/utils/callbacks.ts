// !! avoid external dependencies since this is used in boot script!

type CallbackEffect<T extends any[]> = (...args: T) => void

/**
 * A utility class to hold a collection of callbacks.
 */
export class Callbacks<T extends any[]> {
  private _callbacks: { [id: number]: CallbackEffect<T> } = {}
  private _nextId = 1
  constructor(init?: CallbackEffect<T>[] | CallbackEffect<T>) {
    if (typeof init === 'function') {
      this.add(init)
    } else if (typeof init === 'object' && init && init.length) {
      for (var i = 0; i < init.length; i++) this.add(init[i])
    }
  }

  /**
   * Calls all the callbacks.
   */
  call(...args: T) {
    var callbacks = this._callbacks
    for (var id in callbacks) {
      callbacks[id](...args)
    }
  }

  /**
   * Adds a `callback` Function to this Callbacks collection.
   * Returns a function that, when invoked, removes the inserted `callback` from the collection.
   */
  add(callback: CallbackEffect<T>) {
    var id = this._nextId++
    this._callbacks[id] = callback
    return () => delete this._callbacks[id]
  }
}

export default Callbacks
