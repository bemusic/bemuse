import { createIO } from 'impure'
import * as ReduxState from '../redux/ReduxState'

let _timeout

export function handleSearchTextType (text) {
  return createIO(({ store }) => {
    store.dispatch({ type: ReduxState.MUSIC_SEARCH_TEXT_TYPED, text })
    if (_timeout) clearTimeout(_timeout)
    _timeout = setTimeout(() => {
      store.dispatch({ type: ReduxState.MUSIC_SEARCH_DEBOUNCED })
    }, 138)
  })
}
