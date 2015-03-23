
import Callbacks from 'bemuse/callbacks'

export class Instance2 {
  constructor(options) {
    this._context   = options.context
    this._object    = options.object
    this._children  = options.children
    this._bindings  = [ ]
    this._concerns  = [ ]
    this.onData     = new Callbacks(options.onData)
    this.onDestroy  = new Callbacks(options.onDestroy)
    if (options.bindings) {
      for (let binding of options.bindings) {
        this.bind(...binding)
      }
    }
    if (options.concerns) {
      for (let concern of options.concerns) {
        this._concerns.push(concern.instantiate(this._context, this))
      }
    }
    if (options.children) {
      for (let children of options.children) {
        this._concerns.push(children.instantiate(this._context, this._object))
      }
    }
    if (options.onCreate) {
      new Callbacks(options.onCreate).call()
    }
    if (options.parent) {
      this.attachTo(options.parent)
    }
  }
  bind(...pipeline) {
    let sideEffect = onChange(pipeline.pop())
    if (pipeline.length === 1 && pipeline[0].constant) {
      // optimize: don't add binding when expression is constant --
      // just do it once
      sideEffect(pipeline[0]())
    } else {
      this._bindings.push((value) => {
        for (var i = 0; i < pipeline.length; i ++) {
          value = pipeline[i](value)
        }
        sideEffect(value)
      })
    }
  }
  attachTo(parent) {
    this._parent    = parent
    this._parent.addChild(this._object)
  }
  detach() {
    if (this._parent) {
      this._parent.removeChild(this._object)
      this._parent = null
    }
  }
  push(value) {
    var i
    for (i = 0; i < this._bindings.length; i ++) {
      this._bindings[i](value)
    }
    for (i = 0; i < this._concerns.length; i ++) {
      this._concerns[i].push(value)
    }
    this.onData.call(value)
  }
  destroy() {
    this.detach()
    for (var i = 0; i < this._concerns.length; i ++) {
      this._concerns[i].destroy()
    }
    this.onDestroy.call()
    this._concerns  = null
    this._bindings  = null
    this._parent    = null
    this._object    = null
  }
  get object() {
    return this._object
  }
  get parent() {
    return this._parent
  }
}

export function Instance(context, callback) {

  if (arguments.length === 1) {
    return new Instance2(arguments[0])
  }

  let destroyCallback = []
  let dataCallback = []

  let helper = {
    child(childNode, ...args) {
      let instance = childNode.instantiate(context, ...args)
      destroyCallback.push(() => { instance.destroy() })
      dataCallback.push((data) => { instance.push(data) })
    },
    children(array, ...args) {
      for (let childNode of array) {
        helper.child(childNode, ...args)
      }
    },
    bind(...pipeline) {
      let sideEffect = onChange(pipeline.pop())
      helper.onData(function applyBinding(value) {
        // using var here to optimize
        for (var i = 0; i < pipeline.length; i ++) value = pipeline[i](value)
        sideEffect(value)
      })
    },
    onData(f) {
      dataCallback.push(f)
    },
    onDestroy(f) {
      destroyCallback.push(f)
    },
  }

  callback(helper)
  callback = null

  return {
    destroy() {
      for (let f of destroyCallback) f()
      destroyCallback = null
      dataCallback = null
    },
    push(data) {
      if (dataCallback.length === 0) return
      for (let f of dataCallback) f(data)
    },
  }

}

function onChange(f) {
  let value
  return function receiveNewValue(v) {
    if (value !== v) {
      value = v
      f(v)
    }
  }
}

export default Instance
