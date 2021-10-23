import { getSongResources } from 'bemuse/music-collection/getSongResources'
import { createIO } from 'impure'
import * as ReduxState from '../redux/ReduxState'

export function requestReadme(song) {
  return createIO(({ store }, run) => {
    const collectionUrl = ReduxState.selectCurrentCollectionUrl(
      store.getState()
    )
    if (song && song.readme) {
      return run(requestReadmeForUrl(collectionUrl, song))
    } else {
      return null
    }
  })
}

function requestReadmeForUrl(serverUrl, song) {
  return createIO(async ({ store }) => {
    store.dispatch({ type: ReduxState.README_LOADING_STARTED })
    try {
      const resources = getSongResources(song, serverUrl)
      const readme = song.readme
        ? await resources.baseResources
            .file(song.readme)
            .then((f) => f.read())
            .then((ab) => new Blob([ab], { type: 'text/plain' }).text())
        : ''
      const text = stripFrontMatter(readme)
      store.dispatch({ type: ReduxState.README_LOADED, text })
    } catch (e) {
      store.dispatch({
        type: ReduxState.README_LOADING_ERRORED,
        url: song.readme,
      })
    }
  })
}

function stripFrontMatter(text) {
  return text.replace(/\r\n|\r|\n/g, '\n').replace(/^---\n[\s\S]*?\n---/, '')
}
