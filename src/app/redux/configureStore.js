
import { createStore } from 'redux'
import { reducer } from './stateTree'

export default function configureStore (initialState) {
  const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f
  const store = createStore(reducer, initialState, devTools)
  if (module.hot) {
    module.hot.accept('./stateTree', () => {
      store.replaceReducer(require('./stateTree').reducer)
    })
  }
  return store
}
