import { createStore } from 'redux'
import { reducer } from './ReduxState'

export default function configureStore (initialState) {
  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : f => f
  const store = createStore(reducer, initialState, devTools)
  if (module.hot) {
    module.hot.accept('./ReduxState', () => {
      store.replaceReducer(require('./ReduxState').reducer)
    })
  }
  return store
}
