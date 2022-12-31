// The singleton IO context. This file is needed because many parts of
// our application still depends on a singleton.
//

import * as ReduxState from '../redux/ReduxState'
import createCollectionLoader from '../interactors/createCollectionLoader'
import findMatchingSong from '../interactors/findMatchingSong'
import store from '../redux/instance'
import { getInitiallySelectedSong } from '../query-flags'
import { loadSongFromResources } from '../../custom-song-loader'
import { musicSelectionSlice } from '../entities/MusicSelection'

// Configure a collection loader, which loads the Bemuse music collection.
const collectionLoader = createCollectionLoader({
  fetch: fetch,
  onBeginLoading: (url) =>
    store.dispatch(
      ReduxState.collectionsSlice.actions.COLLECTION_LOADING_BEGAN({ url })
    ),
  onErrorLoading: (url, reason) =>
    store.dispatch(
      ReduxState.collectionsSlice.actions.COLLECTION_LOADING_ERRORED({
        url,
        error: reason,
      })
    ),
  onLoad: (url, data) => {
    store.dispatch(
      ReduxState.collectionsSlice.actions.COLLECTION_LOADED({ url, data })
    )
    const initiallySelectedSong = getInitiallySelectedSong()
    if (initiallySelectedSong) {
      const matchingSong = findMatchingSong({
        songs: data.songs,
        getTitle: (song) => song.title,
        title: initiallySelectedSong,
      })
      if (matchingSong) {
        store.dispatch(
          musicSelectionSlice.actions.MUSIC_SONG_SELECTED({
            songId: matchingSong.id,
          })
        )
      }
    }
  },
})

// Configure a custom song loader which loads custom song from resources.
const customSongLoader = {
  loadSongFromResources: async (resources, options) => {
    const song = await loadSongFromResources(resources, options)
    song.id = '__custom_' + Date.now()
    song.custom = true
    return song
  },
}

export const ioContext = {
  store,
  collectionLoader,
  customSongLoader,
}

export default ioContext
