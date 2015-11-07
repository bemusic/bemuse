
import * as Immutable from 'immutable'

import { INITIAL_OPERATION_STATE, transitionState } from './operations'

const PUT   = 'PUT'
const CLEAR = 'CLEAR'

export const INITIAL_STATE = new Immutable.Map()

export function store川 (action川) {
  return action川.scan(INITIAL_STATE, reduce)
}

export function item川 (state川, id) {
  return state川.map(state => get(state, id)).skipDuplicates()
}

export function reduce (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PUT: {
      let stateChanges = new Immutable.Map(action.data).map(performTransition(state))
      return state.merge(stateChanges)
    }
    case CLEAR: {
      return INITIAL_STATE
    }
    default: {
      return state
    }
  }
}

function performTransition (state) {
  return (transition, id) => transitionState(get(state, id), transition)
}

export function get (state, id) {
  return state.get(id, INITIAL_OPERATION_STATE)
}

export function has (state, id) {
  return state.has(id)
}

export function put (id, transition) {
  return putMultiple(new Immutable.Map([[id, transition]]))
}

export function putMultiple (transitions) {
  return { type: PUT, data: transitions }
}

export function clear () {
  return { type: CLEAR }
}
