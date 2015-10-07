
import { INITIAL_OPERATION_STATE, transitionState } from './operations'

export function DataStore(action川) {

  let data川 = action川.scan({ }, (data, { id, transition }) =>
    Object.assign({ }, data, {
      [id]: transitionState(getState(data, id), transition)
    })
  )

  return {
    data川,
    state川(id) {
      return data川.map(data => getState(data, id))
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
  return { id, transition }
}

export default DataStore
