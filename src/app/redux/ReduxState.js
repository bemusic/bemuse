
import * as Collections from '../entities/Collections'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import createReducer from './createReducer'

// Actions
export const COLLECTION_LOADING_BEGAN = 'COLLECTION_LOADING_BEGAN'
export const COLLECTION_LOADING_ERRORED = 'COLLECTION_LOADING_ERRORED'
export const COLLECTION_LOADED = 'COLLECTION_LOADED'

// Reducer
export const reducer = combineReducers({
  collections: createReducer(Collections.initialState, {
    [COLLECTION_LOADING_BEGAN]: (action) => (
      Collections.beginLoading(action.url)
    ),
    [COLLECTION_LOADING_ERRORED]: (action) => (
      Collections.completeLoading(action.url, action.error)
    ),
    [COLLECTION_LOADED]: (action) => (
      Collections.completeLoading(action.url, action.data)
    ),
  }),
  currentCollection: createReducer('', {
    [COLLECTION_LOADING_BEGAN]: (action) => (state) => (state === ''
      ? action.url
      : state
    )
  }),
})

// Selectors
export const selectCurrentCollectionUrl = state => state.currentCollection

export const selectCurrentCollection = createSelector(
  state => state.collections,
  selectCurrentCollectionUrl,
  (collections, currentCollection) => (
    Collections.getCollectionByUrl(currentCollection)(collections)
  )
)
