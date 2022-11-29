import { AnyAction, Middleware } from 'redux'
import {
  AppState,
  collectionsSlice,
  currentCollectionSlice,
} from './ReduxState'

import { load as loadCollection } from 'bemuse/music-collection'

export const collectionFetchMiddleware: Middleware<{}, AppState> =
  ({ dispatch }) =>
  (next) =>
  (action: AnyAction) => {
    if (
      action.type === collectionsSlice.actions.COLLECTION_LOADING_BEGAN.type
    ) {
      const { url } = action.payload
      dispatch(currentCollectionSlice.actions.COLLECTION_LOADING_BEGAN({ url }))
      loadCollection(url).then(
        (data) =>
          dispatch(collectionsSlice.actions.COLLECTION_LOADED({ url, data })),
        (error: Error) => () =>
          dispatch(
            collectionsSlice.actions.COLLECTION_LOADING_ERRORED({ url, error })
          )
      )
    }

    return next(action)
  }

export default collectionFetchMiddleware
