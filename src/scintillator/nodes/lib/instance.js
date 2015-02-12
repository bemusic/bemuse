
export function Instance(context, callback) {

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
