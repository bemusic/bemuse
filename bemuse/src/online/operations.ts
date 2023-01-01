import { Observable, from, startWith } from 'rxjs'

export type Pending = {
  status: 'pending'
}

export type Loading = {
  status: 'loading'
}

export type Waiting = Pending | Loading

export type Completed<T> = {
  status: 'completed'
  value: T
}

export type Errored = {
  status: 'error'
  error: Error
}

// An asynchronous operation may be in four states:
//
// 0. Pending
// 1. Loading
// 2. Completed
// 3. Error
//
export type Operation<T> = Readonly<Waiting | Completed<T> | Errored>

// A constant representing the initial state of an asynchronous operation
// that may be repeated:
export const INITIAL_OPERATION_STATE = {
  status: 'pending',
} as const

export function loading() {
  return { status: 'loading' } as const
}

export function completed<T>(value: T): Operation<T> {
  return { status: 'completed', value }
}

export function error(error: Error) {
  return { status: 'error', error } as const
}

export function transition<T>(
  previousState: Operation<T> = INITIAL_OPERATION_STATE,
  transition: Operation<T>
): Operation<T> {
  return Object.assign({}, previousState, transition)
}

export function isWaiting<T>(state: Operation<T>): state is Waiting {
  return state.status === 'loading' || state.status === 'pending'
}

// Returns a Promise representing the outcome of a given promise.
// This promise will never be rejected, but will always resolve with a state transition object.
export function outcomeOfPromise<T>(
  promise: PromiseLike<T>
): Promise<Operation<T>> {
  return Promise.resolve(promise).then(completed, error)
}

export function operation川FromPromise<T>(
  promise: PromiseLike<T>
): Observable<Operation<T>> {
  return from(outcomeOfPromise(promise)).pipe(startWith(loading()))
}
