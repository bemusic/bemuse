
import _          from 'lodash'
import Bacon      from 'baconjs'
import { Store }  from 'bemuse/flux'

import * as GameLauncher      from '../game-launcher'
import * as Actions           from '../actions/music-select-actions'
import DefaultCollectionStore from './collection-store'
import OptionsStore           from './options-store'

export function MusicSelectStoreFactory(CollectionStore) {

  const $server       = CollectionStore.map(state => state.server)
  const $collection   = CollectionStore.map(state => state.collection)
  const $unofficial   = CollectionStore.map(state => state.unofficial)
  const $loading      = $collection.map(({ loading }) => loading)

  const $grouping     = Bacon.constant([
    { title: 'Custom Song', criteria: song => song.custom },
    { title: 'Tutorial', criteria: song => song.tutorial },
    { title: 'New Songs',
      criteria: song => song.added &&
          Date.now() - Date.parse(song.added) < 14 * 86400000,
      sort: song => song.added,
      reverse: true, },
    { title: '☆', criteria: () => true },
  ])
  const $filterText   = Bacon.update('',
      [Actions.setFilterText.bus], (prev, filterText) => filterText)
  const $customSongs  = Bacon.update([],
      [Actions.setCustomSong.bus], (prev, song) => [song])
  const $songList     = $collection
      .map(({ collection }) => _((collection && collection.songs) || [])
          .sortByAll([
            song => {
              return _(song.charts)
                .filter({ keys: '7K' })
                .filter(chart => chart.info.difficulty < 5)
                .filter(chart => chart.info.level > 0)
                .map(chart => chart.info.level)
                .min()
            },
            song => song.bpm,
            song => song.title.toLowerCase(),
          ])
          .value())
      .combine($customSongs, (songs, custom) => [...custom, ...songs])
      .combine($filterText, (songs, filterText) =>
          songs.filter(song => matches(song, filterText)))
  const $groups       = $songList.combine($grouping,
      (songs, grouping) => groupBy(songs, grouping))
  const $songs        = $groups.map(groups =>
      _(groups).map('songs').flatten().value())

  const $levelAnchor  = Bacon.update(
      0,
      [Actions.selectChart.bus], (prev, chart) => chart.info.level)

  const $song = Bacon.update(
      null,
      [Actions.selectSong.bus], (prev, song) => song,
      [Actions.setCustomSong.bus], (prev, song) => song,
      [$songs.changes()], ensureSelectedPresent)

  const $charts = $song.map(song => (song && song.charts) || [ ])

  const $visibleCharts = $charts.map(charts => _(charts)
      .filter({ keys: '7K' })
      .sortByAll(
        chart => chart.info.difficulty >= 5 ? 1 : 0,
        chart => chart.info.level
      )
      .value())

  const $levelAnchorStrategy = $levelAnchor.map(level =>
      charts => _.min(charts, chart => Math.abs(chart.info.level - level)))

  const $chart = Bacon.update(
      null,
      [Actions.selectChart.bus], (prev, chart) => chart,
      [$visibleCharts.changes(), $levelAnchorStrategy], ensureSelectedPresent)

  const $mode = OptionsStore.map(state => state.mode)

  Bacon.when(
      [Actions.launchGame.bus,
          $server, $song, $chart], (e, server, song, chart) => (
              { server, song, chart }))
  .onValue(options => GameLauncher.launch(options).done())

  return new Store({
    loading:    $loading,
    server:     $server,
    songs:      $songs,
    groups:     $groups,
    song:       $song,
    charts:     $visibleCharts,
    chart:      $chart,
    filterText: $filterText,
    unofficial: $unofficial,
    playMode:   $mode,
  })

}

export default MusicSelectStoreFactory(DefaultCollectionStore)

function matches(song, filterText) {
  if (!filterText) return true
  return contains(song.title, filterText) ||
      contains(song.artist, filterText) ||
      contains(song.genre, filterText)
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

function groupBy(songs, grouping) {
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
  return _(groups)
      .pluck('output')
      .filter(group => group.songs.length > 0)
      .value()
}
