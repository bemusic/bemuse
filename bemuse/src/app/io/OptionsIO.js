import * as options from '../options'

import { createIO } from 'impure'
import { optionsSlice } from '../entities/Options'

export function loadInitialOptions() {
  return createIO(({ store }) => {
    store.dispatch(
      optionsSlice.actions.LOADED_FROM_STORAGE({
        options: options.getAllCurrentOptions(),
      })
    )

    // HACK: Dispatch when options change!
    options.events.on('changed', () => {
      store.dispatch(
        optionsSlice.actions.LOADED_FROM_STORAGE({
          options: options.getAllCurrentOptions(),
        })
      )
    })
  })
}

export function updateOptions(updater) {
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
