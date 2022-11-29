import { AnyAction, Dispatch } from 'redux'
import { Chart, Song } from 'bemuse/collection-model/types'
import { OptionsState, optionsSlice } from '../entities/Options'
import { getChartLevel, musicSelectionSlice } from '../entities/MusicSelection'

import { ChartProps } from '../ui/MusicList'
import { SceneManager } from 'bemuse/scene-manager'
import { SongMetadataInCollection } from 'bemuse-types'
import { launch } from '../game-launcher'
import { rageQuitSlice } from '../redux/ReduxState'

export function selectSong(
  song: SongMetadataInCollection,
  dispatch: Dispatch<AnyAction>
) {
  dispatch(musicSelectionSlice.actions.MUSIC_SONG_SELECTED({ songId: song.id }))
}

export function selectChart(
  song: SongMetadataInCollection,
  chart: ChartProps,
  dispatch: Dispatch<AnyAction>
) {
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
  autoplayEnabled,
  dispatch,
  options,
  sceneManager,
}: {
  server: { url: string }
  song: Song
  chart: Chart
  autoplayEnabled: boolean
  options: OptionsState
  dispatch: Dispatch<AnyAction>
  sceneManager: SceneManager
}) {
  launch({
    server,
    song,
    chart,
    options,
    saveSpeed: (speed) => {
      dispatch(optionsSlice.actions.CHANGE_SPEED({ speed: speed.toString() }))
    },
    saveLeadTime: (leadTime) => {
      dispatch(optionsSlice.actions.CHANGE_LEAD_TIME({ leadTime }))
    },
    onRagequitted: () => {
      dispatch(rageQuitSlice.actions.RAGEQUITTED())
    },
    autoplayEnabled,
    sceneManager,
  })
}
