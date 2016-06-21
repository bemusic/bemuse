
import { createIO } from 'impure'
import * as ReduxState from '../redux/ReduxState'
import * as GameLauncher from '../game-launcher'
import * as OptionsIO from './OptionsIO'

export function selectSong (song) {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.MUSIC_SONG_SELECTED,
      songId: song.id
    })
  })
}

export function selectChart (song, chart) {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.MUSIC_CHART_SELECTED,
      songId: song.id,
      chartId: chart.file,
      chartLevel: chart.info.level
    })
  })
}

export function launchGame (server, song, chart) {
  return createIO(({ store }, run) => {
    Promise.resolve(GameLauncher.launch({
      server,
      song,
      chart,
      options: store.getState().options,
      saveSpeed: (speed) => { run(OptionsIO.setSpeed(speed)) }
    })).done()
  })
}
