
import { createIO } from 'impure'
import * as ReduxState from '../redux/ReduxState'
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
    store.dispatch({ type: ReduxState.CUSTOM_SONG_LOADED, song })
    return song
  })
}
