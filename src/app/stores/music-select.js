
import _      from 'lodash'
import $      from 'jquery'
import State  from 'bemuse/utils/state'

import * as GameLauncher from '../game-launcher'

let server = { url: '/music' }

export const state = new State({
  loading:    true,
  songs:      [ ],
  song:       undefined,
  chart:      undefined,
})

export function selectSong(song) {
  state.set({
    song:   song,
    chart:  song.charts[0],
  })
}

export function selectChart(chart) {
  state.set({
    chart: chart,
  })
}

export function launchGame() {
  let { song, chart } = state.get()
  GameLauncher.launch({ server, song, chart }).done()
}

Promise.resolve($.get(server.url + '/index.json'))
.then(function(songs) {
  songs = _.sortBy(songs, song => song.tutorial ? 0 : 1)
  state.set({
    songs:      songs,
    song:       songs[0],
    chart:      songs[0].charts[0],
  })
})
.finally(function() {
  state.set({ loading: false })
})
.done()
