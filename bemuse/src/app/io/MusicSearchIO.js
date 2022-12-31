import { createIO } from 'impure'
import { musicSearchTextSlice } from '../entities/MusicSearchText'

let _timeout

export function handleSearchTextType(text) {
  return createIO(({ store }) => {
    store.dispatch(
      musicSearchTextSlice.actions.MUSIC_SEARCH_TEXT_TYPED({ text })
    )
    if (_timeout) clearTimeout(_timeout)
    _timeout = setTimeout(() => {
      store.dispatch(musicSearchTextSlice.actions.MUSIC_SEARCH_DEBOUNCED())
    }, 138)
  })
}
