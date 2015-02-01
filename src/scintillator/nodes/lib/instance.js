
export function Instance(context, callback) {

  let destroyCallback = []

  callback({
    child(childNode, ...args) {
      childNode.instantiate(context, ...args)
    },
    children(array, ...args) {
      for (let childNode of array) {
        childNode.instantiate(context, ...args)
      }
    },
    bind(...pipeline) {
      destroyCallback.push(context.bind(...pipeline))
    },
    onDestroy(f) {
      destroyCallback.push(f)
    },
  })

  callback = null

  return {
    destroy() {
      for (let f of destroyCallback) f()
      destroyCallback = null
    }
  }

}

export default Instance
