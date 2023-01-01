import { INITIAL_OPERATION_STATE, Operation } from './operations'
import { Observable, distinct, map, scan } from 'rxjs'

import Immutable from 'immutable'

export type Action<T> =
  | { type: 'PUT'; data: Record<string, Operation<T>> }
  | { type: 'CLEAR' }

export function put<T>(id: string, transition: Operation<T>) {
  return putMultiple({ [id]: transition })
}

export function putMultiple<T>(transitions: Record<string, Operation<T>>) {
  return { type: PUT, data: transitions } as const
}

export function clear() {
  return { type: CLEAR } as const
}

const PUT = 'PUT'
const CLEAR = 'CLEAR'

export type DataStore<T> = Immutable.Map<string, Operation<T>>

export const initialState = <T>(): DataStore<T> =>
  Immutable.Map<string, Operation<T>>()

export function store川<T>(
  action川: Observable<Action<T>>
): Observable<DataStore<T>> {
  return action川.pipe(scan(reduce, initialState()))
}

export function item川<T>(state川: Observable<DataStore<T>>, id: string) {
  return state川.pipe(map((state) => get(state, id))).pipe(distinct())
}

export function reduce<T>(
  state: DataStore<T> = initialState(),
  action: Action<T>
): DataStore<T> {
  switch (action.type) {
    case PUT: {
      const stateChanges = Immutable.Map(action.data)
      return state.merge(stateChanges)
    }
    case CLEAR: {
      return initialState<T>()
    }
    default: {
      return state
    }
  }
}

export function get<T>(state: DataStore<T>, id: string): Operation<T> {
  return state.get(id, INITIAL_OPERATION_STATE)
}

export function has<T>(state: DataStore<T>, id: string) {
  return state.has(id)
}
