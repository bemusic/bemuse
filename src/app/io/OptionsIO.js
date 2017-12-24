import * as options from '../options'
import * as ReduxState from '../redux/ReduxState'

import { createIO } from 'impure'

export function loadInitialOptions () {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
      options: options.getAllCurrentOptions()
    })

    // HACK: Dispatch when options change!
    options.events.on('changed', () => {
      store.dispatch({
        type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
        options: options.getAllCurrentOptions()
      })
    })
  })
}

export function updateOptions (updater) {
  return createIO(({ store }) => {
    const currentOptions = store.getState().options
    const nextOptions = updater(currentOptions)
    const changes = {}
    for (const key of Object.keys(currentOptions)) {
      if (nextOptions[key] !== currentOptions[key]) {
        changes[key] = nextOptions[key]
      }
    }
    return options.setOptions(changes)
  })
}
