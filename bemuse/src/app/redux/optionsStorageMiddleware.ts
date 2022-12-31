import type { AnyAction, Middleware } from 'redux'
import { initialState, optionsSlice } from '../entities/Options'

import type { AppState } from './ReduxState'

export const optionsStorageMiddleware =
  (storage: Storage = localStorage): Middleware<{}, AppState> =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: AnyAction) => {
    if (action.type === optionsSlice.actions.LOAD_FROM_STORAGE.type) {
      const options: Record<string, string> = {}
      for (const key of Object.keys(initialState)) {
        options[key] = storage.getItem(key) ?? initialState[key]
      }
      dispatch(optionsSlice.actions.LOADED_FROM_STORAGE({ options }))
    }
    next(action)
    if (action.type.startsWith('options/')) {
      const { options } = getState()
      for (const key of Object.keys(options)) {
        storage.setItem(key, options[key])
      }
    }
  }
