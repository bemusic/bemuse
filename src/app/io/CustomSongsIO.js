import * as ReduxState from '../redux/ReduxState'

import { createIO } from 'impure'

import DndResources from '../../resources/dnd-resources'
import {
  downloadFileEntryFromURL,
  CustomSongResources,
} from '../../resources/custom-song-resources'
import { getIPFSResources } from '../../resources/ipfs-resources'

export function handleCustomSongFolderDrop(event) {
  return createIO(async ({ store, customSongLoader }) => {
    const resources = new DndResources(event)
    const initialLog = ['Examining dropped items...']
    return loadCustomSong(resources, initialLog, { store, customSongLoader })
  })
}

export function handleCustomSongURLLoad(url) {
  return createIO(async ({ store, customSongLoader }) => {
    const resources = new CustomSongResources({
      getFiles: async log => [await downloadFileEntryFromURL(url, log)],
    })
    const initialLog = ['Loading from ' + url]
    return loadCustomSong(resources, initialLog, { store, customSongLoader })
  })
}

export function handleClipboardPaste(e) {
  return createIO(async ({ store, customSongLoader }) => {
    let match
    const text = e.clipboardData.getData('text/plain')
    match = text.match(/(https?:\/\/[a-zA-Z0-9:.-]+)?(\/ipfs\/\S+)/)
    if (match) {
      const gateway = match[1] || undefined
      const path = gateway ? decodeURI(match[2]) : match[2]
      const resources = getIPFSResources(path, gateway)
      const initialLog = [
        'Loading from IPFS path ' + path + '...',
        `(Using ${resources.gatewayName})`,
      ]
      if (/^http:/.test(gateway) && window.location.protocol === 'https:') {
        initialLog.push(
          store,
          'WARNING: Loading http URL from https. This will likely fail!'
        )
      }
      return loadCustomSong(resources, initialLog, { store, customSongLoader })
    }
  })
}

async function loadCustomSong(
  resources,
  initialText,
  { store, customSongLoader }
) {
  try {
    store.dispatch({ type: ReduxState.CUSTOM_SONG_LOAD_STARTED })
    for (const text of initialText) {
      store.dispatch({ type: ReduxState.CUSTOM_SONG_LOG_EMITTED, text })
    }
    const song = await customSongLoader.loadSongFromResources(resources, {
      onMessage(text) {
        store.dispatch({ type: ReduxState.CUSTOM_SONG_LOG_EMITTED, text })
      },
    })
    if (song && song.charts && song.charts.length) {
      store.dispatch({ type: ReduxState.CUSTOM_SONG_LOADED, song })
      return song
    } else {
      store.dispatch({ type: ReduxState.CUSTOM_SONG_LOAD_FAILED })
    }
  } catch (e) {
    const text = `Error caught: ${e}`
    store.dispatch({ type: ReduxState.CUSTOM_SONG_LOG_EMITTED, text })
    throw e
  }
}
