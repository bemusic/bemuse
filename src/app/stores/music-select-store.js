
import _          from 'lodash'
import Bacon      from 'baconjs'
import { Store }  from 'bemuse/flux'

import * as GameLauncher      from '../game-launcher'
import * as Actions           from '../actions/music-select-actions'
import { visibleCharts, isChartPlayable } from '../utils/music-select-utils'
import DefaultCollectionStore from './collection-store'
import OptionsStore           from './options-store'

export function MusicSelectStoreFactory (CollectionStore, options = { }) {

  const debounce = (typeof options.debounce === 'undefined'
    ? true
    : options.debounce
  )

  const server川 = CollectionStore.map(state => state.server)
  const collection川 = CollectionStore.map(state => state.collection)
  const unofficial川 = CollectionStore.map(state => state.unofficial)
  const error川 = collection川.map(state => state.error)
  const loading川 = collection川.map(({ loading }) => loading)

  const grouping川 = Bacon.constant([
    { title: 'Custom Song', criteria: song => song.custom },
    { title: 'Tutorial', criteria: song => song.tutorial },
    { title: 'New Songs',
      criteria: song => song.added &&
          Date.now() - Date.parse(song.added) < 14 * 86400000,
      sort: song => song.added,
      reverse: true, },
    { title: '☆', criteria: () => true },
  ])

  const filterText川 = Bacon.update('',
    [Actions.setFilterText.bus], (prev, filterText) => filterText
  )

  const filterTextDebounced川 = (debounce
    ? filterText川.debounce(138)
    : filterText川
  )

  const customSongs川 = Bacon.update([],
    [Actions.setCustomSong.bus], (prev, song) => [song]
  )

  const rawSongsFromCollection川 = (collection川
    .map(({ collection }) => (collection && collection.songs) || [])
  )

  const songList川 = (rawSongsFromCollection川
    .map(sortSongs)
    .combine(customSongs川, (songs, custom) => [...custom, ...songs])
    .combine(filterTextDebounced川, filterSongs)
  )

  const groups川 = songList川.combine(grouping川,
    (songs, grouping) => groupBy(songs, grouping)
  )

  const songs川 = groups川.map(groups =>
    _(groups).map('songs').flatten().value()
  )

  const song川 = Bacon.update(null,
    [Actions.selectSong.bus], (prev, song) => song,
    [Actions.setCustomSong.bus], (prev, song) => song,
    [songs川.changes()], ensureSelectedPresent
  )

  const charts川 = song川.map(song => (song && song.charts) || [ ])

  const visibleCharts川 = charts川.map(visibleCharts)

  const chart川 = Bacon.update(null,
    [Actions.selectChart.bus], (prev, chart) => chart,
    [visibleCharts川.changes()], ensureSelectedPresentWithStrategy(selectClosestLevel)
  )

  const mode川 = OptionsStore.map(state => state.mode)

  Bacon.when(
    [Actions.launchGame.bus, server川, song川, chart川],
    (e, server, song, chart) => ({ server, song, chart })
  )
  .onValue(options => GameLauncher.launch(options).done())

  return new Store({
    loading:    loading川,
    error:      error川,
    server:     server川,
    songs:      songs川,
    groups:     groups川,
    song:       song川,
    charts:     visibleCharts川,
    chart:      chart川,
    filterText: filterText川,
    highlight:  filterTextDebounced川,
    unofficial: unofficial川,
    playMode:   mode川,
  })

}

export default MusicSelectStoreFactory(DefaultCollectionStore)

function sortSongs (songs) {
  return _.sortByAll(songs, [
    song => {
      return (_(song.charts)
        .filter(isChartPlayable)
        .filter(chart => chart.info.difficulty < 5)
        .filter(chart => chart.info.level > 0)
        .map(chart => chart.info.level)
        .min()
      )
    },
    song => song.bpm,
    song => song.title.toLowerCase(),
  ])
}

function filterSongs (songs, filterText) {
  return songs.filter(song => matches(song, filterText))
}

function matches (song, filterText) {
  if (!filterText) return true
  return (
    contains(song.title, filterText) ||
    contains(song.artist, filterText) ||
    contains(song.genre, filterText)
  )
}

function contains (haystack, needle) {
  return String(haystack.toLowerCase()).indexOf(needle.toLowerCase()) >= 0
}

function ensureSelectedPresentWithStrategy (strategy) {
  return (previous, items) => (items && items.length && items.indexOf(previous) === -1
    ? strategy(previous, items)
    : previous
  )
}

function ensureSelectedPresent (previous, items) {
  return ensureSelectedPresentWithStrategy(selectFirstItem)(previous, items)
}

function selectFirstItem (previous, items) {
  return items[0]
}

function selectClosestLevel (previous, charts) {
  let level = (previous && previous.info && previous.info.level) || 0
  return _.min(charts, chart => Math.abs(chart.info.level - level))
}

function groupBy (songs, grouping) {
  let groups = grouping.map(group => ({
    input:  group,
    output: { title: group.title, songs: [ ] },
  }))
  for (let song of songs) {
    for (let { input, output } of groups) {
      if (input.criteria(song)) {
        output.songs.push(song)
        break
      }
    }
  }
  for (let { input, output } of groups) {
    if (input.sort)     output.songs = _.sortBy(output.songs, input.sort)
    if (input.reverse)  output.songs.reverse()
  }
  return (_(groups)
    .pluck('output')
    .filter(group => group.songs.length > 0)
    .value()
  )
}
