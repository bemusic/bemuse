import * as GameLauncher from '../game-launcher'
import * as Options from '../entities/Options'
import * as ReduxState from '../redux/ReduxState'
import { getChartLevel, musicSelectionSlice } from '../entities/MusicSelection'

export function selectSong(song, dispatch) {
  dispatch(
    musicSelectionSlice.actions.MUSIC_SONG_SELECTED({
      songId: song.id,
    })
  )
}

export function selectChart(song, chart, dispatch) {
  dispatch(
    musicSelectionSlice.actions.MUSIC_CHART_SELECTED({
      songId: song.id,
      chartId: chart.file,
      chartLevel: getChartLevel(chart),
    })
  )
}

export function launchGame({
  server,
  song,
  chart,
  options,
  dispatch,
  autoplayEnabled,
}) {
  GameLauncher.launch({
    server,
    song,
    chart,
    options,
    saveSpeed: (speed) => {
      dispatch(Options.optionsSlice.actions.CHANGE_SPEED({ speed }))
    },
    saveLeadTime: (leadTime) => {
      dispatch(Options.optionsSlice.actions.CHANGE_LEAD_TIME({ leadTime }))
    },
    onRagequitted: () => {
      dispatch(ReduxState.rageQuitSlice.actions.RAGEQUITTED())
    },
    autoplayEnabled,
  })
}
