
import { createIO } from 'impure'
import { getAllCurrentOptions, events } from '../options'
import * as ReduxState from '../redux/ReduxState'

export function loadInitialOptions () {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
      options: getAllCurrentOptions()
    })

    // HACK: Dispatch when options change!
    events.on('changed', () => {
      store.dispatch({
        type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
        options: getAllCurrentOptions()
      })
    })
  })
}
