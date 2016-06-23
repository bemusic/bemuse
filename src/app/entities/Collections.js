import Immutable from 'immutable'
import * as LoadState from './LoadState'

export const initialState = Immutable.Map()

export const beginLoading = (url) => (state) => (
  state.set(url, LoadState.initLoading())
)

export const completeLoading = (url, data) => (state) => (
  state.update(url, LoadState.completeWithValue(data))
)

export const errorLoading = (url, error) => (state) => (
  state.update(url, LoadState.errorWithReason(error))
)

export const getCollectionByUrl = (url) => (state) => (
  state.get(url)
)
