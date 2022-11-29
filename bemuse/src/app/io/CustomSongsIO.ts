import type { Dispatch } from 'redux'
import { URLResources } from 'bemuse/resources/url'

import DndResources from '../../resources/dnd-resources'
import type { CustomSongLoader } from './customSongLoader'
import {
  CustomSongResources,
  downloadFileEntryFromURL,
} from '../../resources/custom-song-resources'
import { getIPFSResources } from '../../resources/ipfs-resources'
import { loadCustomSong } from '../CustomSongs'

export interface CustomSongsIO {
  dispatch: Dispatch
  customSongLoader: CustomSongLoader
}

export const handleCustomSongFileSelect =
  ({ dispatch, customSongLoader }: CustomSongsIO) =>
  (selectedFile: File) => {
    const resources = new CustomSongResources({
      getFiles: async () => [{ name: selectedFile.name, file: selectedFile }],
    })
    const initialLog = ['Examining selected items...']
    return loadCustomSong(resources, initialLog, { dispatch, customSongLoader })
  }

export const handleCustomSongFolderDrop =
  ({ dispatch, customSongLoader }: CustomSongsIO) =>
  (event: DragEvent) => {
    const resources = new DndResources(event)
    const initialLog = ['Examining dropped items...']
    return loadCustomSong(resources, initialLog, { dispatch, customSongLoader })
  }

export const handleCustomSongURLLoad =
  ({ dispatch, customSongLoader }: CustomSongsIO) =>
  (url: string) => {
    const resources = new CustomSongResources({
      getFiles: async (log) => [await downloadFileEntryFromURL(url, log)],
    })
    const initialLog = ['Loading from ' + url]
    return loadCustomSong(resources, initialLog, { dispatch, customSongLoader })
  }

export const handleClipboardPaste =
  ({ dispatch, customSongLoader }: CustomSongsIO) =>
  (e: ClipboardEvent) => {
    const text = e.clipboardData!.getData('text/plain')
    {
      const match = text.match(
        /https?:\/\/[a-zA-Z0-9:.-]+(?:\/\S+)?\/bemuse-song\.json/
      )
      if (match) {
        const url = match[0]
        const initialLog = ['Loading prepared song...']
        const resources = new PreparedSongResources(new URL(url))
        return loadCustomSong(resources, initialLog, {
          dispatch,
          customSongLoader,
        })
      }
    }
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
        if (
          gateway &&
          /^http:/.test(gateway) &&
          window.location.protocol === 'https:'
        ) {
          initialLog.push(
            'WARNING: Loading http URL from https. This will likely fail!'
          )
        }
        return loadCustomSong(resources, initialLog, {
          dispatch,
          customSongLoader,
        })
      }
    }
  }

class PreparedSongResources extends URLResources {
  fileList = Promise.resolve(['bemuse-song.json'])
}
