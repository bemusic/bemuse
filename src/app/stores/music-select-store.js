
import _          from 'lodash'
import $          from 'jquery'
import Bacon      from 'baconjs'
import { Store }  from 'bemuse/flux'

import * as GameLauncher from '../game-launcher'
import * as Actions      from '../actions/music-select-actions'

const $server       = Bacon.constant({ url: '/music' })
const $collection   = $server.flatMapLatest(loadCollection)

const $loading      = $collection.map(({ loading }) => loading).toProperty(true)
const $songs        = $collection.map(({ collection }) =>
    _((collection && collection.songs) || [])
        .sortBy(song => song.tutorial ? 0 : 1)
        .value()).toProperty([])

const $levelAnchor  = Bacon.update(
    0,
    [Actions.selectChart.bus], (prev, chart) => chart.info.level)

const $filterText = Bacon.update(
    '',
    [Actions.setFilterText.bus], (prev, filterText) => filterText)

const $visibleSongs = $songs.combine($filterText, (songs, filterText) =>
    songs.filter(song => matches(song, filterText)))

const $song = Bacon.update(
    null,
    [Actions.selectSong.bus], (prev, song) => song,
    [$visibleSongs.changes()], ensureSelectedPresent)

const $charts = $song.map(song => (song && song.charts) || [ ])

const $visibleCharts = $charts.map(charts => _(charts)
    .filter({ keys: '7K' })
    .sortBy(chart => chart.info.level)
    .value())

const $levelAnchorStrategy = $levelAnchor.map(level =>
    charts => _.min(charts, chart => Math.abs(chart.info.level - level)))

const $chart = Bacon.update(
    null,
    [Actions.selectChart.bus], (prev, chart) => chart,
    [$visibleCharts.changes(), $levelAnchorStrategy], ensureSelectedPresent)

Bacon.when(
    [Actions.launchGame.bus,
        $server, $song, $chart], (e, server, song, chart) => (
            { server, song, chart }))
.onValue(options => GameLauncher.launch(options))

export default new Store({
  loading:    $loading,
  server:     $server,
  songs:      $visibleSongs,
  song:       $song,
  charts:     $visibleCharts,
  chart:      $chart,
  filterText: $filterText,
})

function loadCollection(server) {
  let promise = Promise.resolve($.get(server.url + '/index.json'))
  .then(function(collection) {
    return { loading: false, collection: collection }
  })
  .catch(function(e) {
    return { loading: false, error: e }
  })
  return Bacon.once({ loading: true }).merge(Bacon.fromPromise(promise))
}

function matches(song, filterText) {
  if (!filterText) return true
  return contains(song.title, filterText) ||
      contains(song.artist, filterText)
}

function contains(haystack, needle) {
  return String(haystack.toLowerCase()).indexOf(needle.toLowerCase()) >= 0
}

function ensureSelectedPresent(previous, items, strategy) {
  if (items && items.length && items.indexOf(previous) === -1) {
    return strategy ? strategy(items) : items[0]
  } else {
    return previous
  }
}
