import * as GameLauncher from '../game-launcher'
import * as Options from '../entities/Options'
import * as OptionsIO from './OptionsIO'
import * as ReduxState from '../redux/ReduxState'

import { createIO } from 'impure'
import { getChartLevel } from '../entities/MusicSelection'

export function selectSong(song) {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.MUSIC_SONG_SELECTED,
      songId: song.id,
    })
  })
}

export function selectChart(song, chart) {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.MUSIC_CHART_SELECTED,
      songId: song.id,
      chartId: chart.file,
      chartLevel: getChartLevel(chart),
    })
  })
}

export function launchGame(server, song, chart, { autoplayEnabled }) {
  return createIO(({ store }, run) => {
    GameLauncher.launch({
      server,
      song,
      chart,
      options: store.getState().options,
      saveSpeed: (speed) => {
        run(OptionsIO.updateOptions(Options.changeSpeed(speed)))
      },
      saveLeadTime: (leadTime) => {
        run(OptionsIO.updateOptions(Options.changeLeadTime(leadTime)))
      },
      onRagequitted: () => {
        store.dispatch({ type: ReduxState.RAGEQUITTED })
      },
      autoplayEnabled,
    })
  })
}
