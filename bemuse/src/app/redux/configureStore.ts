import { Middleware, compose } from 'redux'

import { collectionFetchMiddleware } from './collectionFetchMiddleware'
import { collectionLoader } from './collectionLoader'
import { configureStore as createStore } from '@reduxjs/toolkit'
import { optionsStorageMiddleware } from './optionsStorageMiddleware'
import { reducer } from './ReduxState'

declare global {
  interface Window {
    devToolsExtension?: typeof compose
  }
}

export default function configureStore() {
  const devTools = () =>
    window.devToolsExtension ? window.devToolsExtension() : <T>(f: T) => f
  const middleware: Middleware[] = [
    optionsStorageMiddleware(),
    collectionFetchMiddleware,
    collectionLoader,
    devTools,
  ]
  const store = createStore({ reducer, middleware })
  return store
}
