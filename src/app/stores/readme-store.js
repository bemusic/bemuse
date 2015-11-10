
import $          from 'jquery'
import Bacon      from 'baconjs'
import { Store }  from 'bemuse/flux'

import MusicSelectStore from './music-select-store'

const url川 = MusicSelectStore.map(state => {
  let { server, song } = state
  if (song && song.readme) {
    return server.url + '/' + song.path + '/' + song.readme
  } else {
    return null
  }
})

const readme川 = url川.skipDuplicates().flatMapLatest(readme川ForUrl).toProperty('')

export default new Store({
  text: readme川
}, { lazy: true })

function readme川ForUrl (url) {
  if (url === null) return Bacon.once('Information unavailable…')
  let promise = Promise.resolve($.get(url))
  .then(function (text) {
    return stripFrontMatter('' + text)
  })
  .catch(function () {
    return 'Unable to download ' + url
  })
  return Bacon.once('Loading...').merge(Bacon.fromPromise(promise))
}

function stripFrontMatter (text) {
  return text.replace(/\r\n|\r|\n/g, '\n').replace(/^---\n[\s\S]*?\n---/, '')
}
