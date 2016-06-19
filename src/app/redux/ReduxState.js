
import * as Collections from '../entities/Collections'
import * as LoadState from '../entities/LoadState'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import createReducer from './createReducer'

// Actions
export const COLLECTION_LOADING_BEGAN = 'COLLECTION_LOADING_BEGAN'
export const COLLECTION_LOADING_ERRORED = 'COLLECTION_LOADING_ERRORED'
export const COLLECTION_LOADED = 'COLLECTION_LOADED'
export const CUSTOM_SONG_LOAD_STARTED = 'CUSTOM_SONG_LOAD_STARTED'
export const CUSTOM_SONG_LOG_EMITTED = 'CUSTOM_SONG_LOG_EMITTED'
export const CUSTOM_SONG_LOADED = 'CUSTOM_SONG_LOADED'

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
  customSongLoadState: createReducer(LoadState.initCompletedWithValue(null), {
    [CUSTOM_SONG_LOAD_STARTED]: (action) => (
      LoadState.beginLoading
    ),
    [CUSTOM_SONG_LOADED]: (action) => (
      LoadState.completeWithValue(action.song)
    )
  }),
  customSongLoaderLog: createReducer(null, {
    [CUSTOM_SONG_LOAD_STARTED]: (action) => (state) => [ ],
    [CUSTOM_SONG_LOG_EMITTED]: (action) => (state) => state && [ ...state, action.text ],
    [CUSTOM_SONG_LOADED]: (action) => (state) => null
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

export const selectCustomSongLoaderLog = state => state.customSongLoaderLog
