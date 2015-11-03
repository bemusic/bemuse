
import Bacon from 'baconjs'

// An asynchronous operation may be in four states:
//
// 0. Pending
// 1. Loading
// 2. Completed
// 3. Error
//

// A constant representing the initial state of an asynchronous operation
// that may be repeated:
export const INITIAL_OPERATION_STATE = { status: 'pending', value: null, error: null }

export function loadingStateTransition() {
  return { status: 'loading', error: null }
}

export function completedStateTransition(value) {
  return { status: 'completed', value, error: null }
}

export function errorStateTransition(error) {
  return { status: 'error', error }
}

export function transitionState(previousState=INITIAL_OPERATION_STATE, transition) {
  return Object.assign({ }, previousState, transition)
}

export function isWaiting(state) {
  return state.status === 'loading' || state.status === 'pending'
}

// Returns a Promise representing the outcome of a given promise.
// This promise will never be rejected, but will always resolve with a state transition object.
export function outcomeOfPromise(promise) {
  return Promise.resolve(promise).then(
    completedStateTransition,
    errorStateTransition
  )
}

export function transition川FromPromise(promise) {
  return Bacon.fromPromise(outcomeOfPromise(promise)).startWith(loadingStateTransition())
}

export function operationState川(transition川) {
  return transition川.scan(INITIAL_OPERATION_STATE, transitionState)
}
