import { createIO } from 'impure'
import $ from 'jquery'
import * as ReduxState from '../redux/ReduxState'

export function requestReadme (song) {
  return createIO(({ store }, run) => {
    const collectionUrl = ReduxState.selectCurrentCollectionUrl(
      store.getState()
    )
    if (song && song.readme) {
      const readmeUrl = collectionUrl + '/' + song.path + '/' + song.readme
      return run(requestReadmeForUrl(song.id, readmeUrl))
    } else {
      return null
    }
  })
}

function requestReadmeForUrl (songId, url) {
  return createIO(async ({ store }) => {
    store.dispatch({ type: ReduxState.README_LOADING_STARTED })
    try {
      const text = stripFrontMatter(String(await Promise.resolve($.get(url))))
      store.dispatch({ type: ReduxState.README_LOADED, text })
    } catch (e) {
      store.dispatch({ type: ReduxState.README_LOADING_ERRORED, url })
    }
  })
}

function stripFrontMatter (text) {
  return text.replace(/\r\n|\r|\n/g, '\n').replace(/^---\n[\s\S]*?\n---/, '')
}
