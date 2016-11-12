import * as Options from '../entities/Options'
import * as GameLauncher from '../game-launcher'
import * as ReduxState from '../redux/ReduxState'
import * as OptionsIO from './OptionsIO'

import { createIO } from 'impure'

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
      saveSpeed: (speed) => { run(OptionsIO.updateOptions(Options.changeSpeed(speed))) },
      saveLeadTime: (leadTime) => { run(OptionsIO.updateOptions(Options.changeLeadTime(leadTime))) }
    })).done()
  })
}
