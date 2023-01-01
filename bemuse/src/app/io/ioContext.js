// The singleton IO context. This file is needed because many parts of
// our application still depends on a singleton.
//

import { loadSongFromResources } from '../../custom-song-loader'
import store from '../redux/instance'

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
  customSongLoader,
}

export default ioContext
