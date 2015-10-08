
import { INITIAL_OPERATION_STATE, transitionState } from './operations'

export function DataStore(action川) {

  let data川 = action川.scan({ }, (data, object) => {
    let clone = Object.assign({ }, data)
    for (let id in object) {
      if (object.hasOwnProperty(id)) {
        clone[id] = transitionState(getState(data, id), object[id])
      }
    }
    return clone
  })

  return {
    data川,
    state川(id) {
      return data川.map(data => getState(data, id)).skipDuplicates()
    },
  }

}

export function getState (data, id) {
  return data[id] || INITIAL_OPERATION_STATE
}

export function hasState (data, id) {
  return data.hasOwnProperty(id)
}

export function put(id, transition) {
  return { [id]: transition }
}

export function multiPutBuilder() {
  let changes = { }
  return {
    with(items, id, f) {
      for (let item of items) {
        changes[id(item)] = f(item)
      }
      return this
    },
    build() {
      return changes
    },
  }
}

export default DataStore
