import { createIO } from 'impure'

import { loadCustomSong } from '../CustomSongs'
import DndResources from '../../resources/dnd-resources'
import {
  downloadFileEntryFromURL,
  CustomSongResources,
} from '../../resources/custom-song-resources'
import { getIPFSResources } from '../../resources/ipfs-resources'
import { URLResources } from 'bemuse/resources/url'

export function handleCustomSongFileSelect(selectedfile) {
  return createIO(async ({ store, customSongLoader }) => {
    const resources = new CustomSongResources({
      getFiles: async () => [{ name: selectedfile.name, file: selectedfile }],
    })
    const initialLog = ['Examining selected items...']
    return loadCustomSong(resources, initialLog, { store, customSongLoader })
  })
}

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
      getFiles: async (log) => [await downloadFileEntryFromURL(url, log)],
    })
    const initialLog = ['Loading from ' + url]
    return loadCustomSong(resources, initialLog, { store, customSongLoader })
  })
}

export function handleClipboardPaste(e) {
  return createIO(async ({ store, customSongLoader }) => {
    const text = e.clipboardData.getData('text/plain')
    {
      const match = text.match(/(https?:\/\/[a-zA-Z0-9:.-]+)?(\/ipfs\/\S+)/)
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
        return loadCustomSong(resources, initialLog, {
          store,
          customSongLoader,
        })
      }
    }
    {
      const match = text.match(
        /https?:\/\/[a-zA-Z0-9:.-]+\/\S+\/bemuse-song\.json/
      )
      if (match) {
        const url = match[0]
        const initialLog = ['Loading prepared song...']
        const resources = new PreparedSongResources(new URL(url))
        return loadCustomSong(resources, initialLog, {
          store,
          customSongLoader,
        })
      }
    }
  })
}

class PreparedSongResources extends URLResources {
  fileList = Promise.resolve(['bemuse-song.json'])
}
