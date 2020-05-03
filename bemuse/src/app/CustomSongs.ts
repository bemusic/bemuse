import { observable } from 'mobx'
import { useObserver } from 'mobx-react-lite'
import * as ReduxState from './redux/ReduxState'
import { IResources } from 'bemuse/resources/types'

const state = observable({
  loaderLog: null as string[] | null,
})

export function useCustomSongLoaderLog() {
  // We need to clone the array to make sure that all items inside it gets properly tracked.
  // Since this array will be very small, performance impact is negligible.
  return useObserver(() => state.loaderLog && Array.from(state.loaderLog))
}

export async function loadCustomSong(
  resources: IResources,
  initialLog: string[],
  { customSongLoader, store }: { customSongLoader: TODO; store: TODO }
) {
  state.loaderLog = [...initialLog]
  const log = state.loaderLog
  try {
    const song = await customSongLoader.loadSongFromResources(resources, {
      onMessage(text: string) {
        log.push(text)
      },
    })
    if (song && song.charts && song.charts.length) {
      state.loaderLog = null
      store.dispatch({ type: ReduxState.CUSTOM_SONG_LOADED, song })
      return song
    } else {
      state.loaderLog = null
    }
  } catch (e) {
    const text = `Error caught: ${e}`
    log.push(text)
    throw e
  }
}
