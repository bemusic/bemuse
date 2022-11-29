import type { AnyAction, Middleware } from 'redux'
import type { SongMetadataInCollection } from 'bemuse-types'

import findMatchingSong from '../interactors/findMatchingSong'
import { collectionsSlice } from '../redux/ReduxState'
import { getInitiallySelectedSong } from '../query-flags'
import { musicSelectionSlice } from '../entities/MusicSelection'

// Configure a collection loader, which loads the Bemuse music collection.
export const collectionLoader: Middleware =
  ({ dispatch }) =>
  (next) =>
  <A extends AnyAction>(action: A) => {
    if (action.type !== collectionsSlice.actions.COLLECTION_LOADED.type) {
      return next(action)
    }
    const ret = next(action)
    const initiallySelectedSong = getInitiallySelectedSong()
    if (initiallySelectedSong) {
      const matchingSong = findMatchingSong({
        songs: action.data.songs,
        getTitle: (song: SongMetadataInCollection) => song.title,
        title: initiallySelectedSong,
      })
      if (matchingSong) {
        dispatch(
          musicSelectionSlice.actions.MUSIC_SONG_SELECTED({
            songId: matchingSong.id,
          })
        )
      }
    }
    return ret
  }
