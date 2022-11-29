import type { AnyAction, Dispatch } from 'redux'

import { musicSearchTextSlice } from '../entities/MusicSearchText'

let _timeout: NodeJS.Timeout

export function handleSearchTextType(
  text: string,
  dispatch: Dispatch<AnyAction>
) {
  dispatch(musicSearchTextSlice.actions.MUSIC_SEARCH_TEXT_TYPED({ text }))
  if (_timeout) clearTimeout(_timeout)
  _timeout = setTimeout(() => {
    dispatch(musicSearchTextSlice.actions.MUSIC_SEARCH_DEBOUNCED())
  }, 138)
}
