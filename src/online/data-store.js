
import _ from 'lodash'

import { INITIAL_OPERATION_STATE, transitionState } from './operations'

const PUT   = 'PUT'
const CLEAR = 'CLEAR'

export const INITIAL_STATE = { }

export function store川(action川) {
  return action川.scan(INITIAL_STATE, reduce)
}

export function item川(state川, id) {
  return state川.map(state => get(state, id)).skipDuplicates()
}

export function reduce(state=INITIAL_STATE, action) {
  switch (action.type) {
    case PUT: {
      let stateChanges = _.mapValues(action.data, performTransition(state))
      return Object.assign({ }, state, stateChanges)
    }
    case CLEAR: {
      return INITIAL_STATE
    }
    default: {
      return state
    }
  }
}

function performTransition(state) {
  return (transition, id) => transitionState(get(state, id), transition)
}

export function get(state, id) {
  return state[id] || INITIAL_OPERATION_STATE
}

export function has(state, id) {
  return state.hasOwnProperty(id)
}

export function put(id, transition) {
  return putMultiple({ [id]: transition })
}

export function putMultiple(transitions) {
  return { type: PUT, data: transitions }
}

export function clear() {
  return { type: CLEAR }
}
