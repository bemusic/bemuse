
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
      helper.onData(function(value) {
        for (let f of pipeline) value = f(value)
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

export default Instance
