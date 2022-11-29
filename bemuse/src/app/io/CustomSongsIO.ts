import { AnyAction, Dispatch } from 'redux'
import {
  CustomSongResources,
  downloadFileEntryFromURL,
} from '../../resources/custom-song-resources'

import DndResources from '../../resources/dnd-resources'
import { URLResources } from 'bemuse/resources/url'
import { getIPFSResources } from '../../resources/ipfs-resources'
import { loadCustomSong } from '../CustomSongs'

export const handleCustomSongFileSelect =
  (dispatch: Dispatch<AnyAction>) => (selectedFile: File) => {
    const resources = new CustomSongResources({
      getFiles: async () => [{ name: selectedFile.name, file: selectedFile }],
    })
    const initialLog = ['Examining selected items...']
    return loadCustomSong(resources, initialLog, dispatch)
  }

export const handleCustomSongFolderDrop =
  (dispatch: Dispatch<AnyAction>) => (event: DragEvent) => {
    const resources = new DndResources(event)
    const initialLog = ['Examining dropped items...']
    return loadCustomSong(resources, initialLog, dispatch)
  }

export const handleCustomSongURLLoad =
  (dispatch: Dispatch<AnyAction>) => (url: string) => {
    const resources = new CustomSongResources({
      getFiles: async (log) => [await downloadFileEntryFromURL(url, log)],
    })
    const initialLog = ['Loading from ' + url]
    return loadCustomSong(resources, initialLog, dispatch)
  }

export const handleClipboardPaste =
  (dispatch: Dispatch<AnyAction>) => (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData('text/plain')
    if (!text) {
      return
    }
    {
      const match = text.match(
        /https?:\/\/[a-zA-Z0-9:.-]+(?:\/\S+)?\/bemuse-song\.json/
      )
      if (match) {
        const url = match[0]
        const initialLog = ['Loading prepared song...']
        const resources = new PreparedSongResources(new URL(url))
        return loadCustomSong(resources, initialLog, dispatch)
      }
    }
    {
      const match = text.match(/(https?:\/\/[a-zA-Z0-9:.-]+)?(\/ipfs\/\S+)/)
      if (match) {
        const gateway = match[1] || ''
        const path = gateway ? decodeURI(match[2]) : match[2]
        const resources = getIPFSResources(path, gateway)
        const initialLog = [
          'Loading from IPFS path ' + path + '...',
          `(Using ${resources.gatewayName})`,
        ]
        if (/^http:/.test(gateway) && window.location.protocol === 'https:') {
          initialLog.push(
            'WARNING: Loading http URL from https. This will likely fail!'
          )
        }
        return loadCustomSong(resources, initialLog, dispatch)
      }
    }
  }

class PreparedSongResources extends URLResources {
  fileList = Promise.resolve(['bemuse-song.json'])
}
