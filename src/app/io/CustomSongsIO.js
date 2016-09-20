import * as ReduxState from '../redux/ReduxState'

import { createIO } from 'impure'

import DndResources from '../../resources/dnd-resources'

export function handleCustomSongFolderDrop (event) {
  return createIO(async ({ store, customSongLoader }) => {
    store.dispatch({ type: ReduxState.CUSTOM_SONG_LOAD_STARTED })
    const resources = new DndResources(event)
    const song = await customSongLoader.loadSongFromResources(resources, {
      onMessage (text) {
        store.dispatch({ type: ReduxState.CUSTOM_SONG_LOG_EMITTED, text })
      }
    })
    if (song && song.charts && song.charts.length) {
      store.dispatch({ type: ReduxState.CUSTOM_SONG_LOADED, song })
      return song
    } else {
      store.dispatch({ type: ReduxState.CUSTOM_SONG_LOAD_FAILED })
    }
  })
}
