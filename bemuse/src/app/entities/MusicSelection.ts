import type { Chart, SongMetadataInCollection } from 'bemuse-types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import produce, { Draft } from 'immer'

import { ChartProps } from '../ui/MusicList'
import _ from 'lodash'

export interface MusicSelectionState {
  selectedSongId: string | null
  selectedChartId: string | null
  selectedChartLevel: number
}

export const initialState: MusicSelectionState = {
  selectedSongId: null,
  selectedChartId: null,
  selectedChartLevel: 1,
}

// Queries
export const selectedSongGivenSongs =
  (songs: SongMetadataInCollection[]) =>
  (state: MusicSelectionState): SongMetadataInCollection => {
    const song = _.find(songs, (item) => item.id === state.selectedSongId)
    if (song) return song
    return songs[0]
  }
export const selectedChartGivenCharts =
  (charts: Chart[] = []) =>
  (state: MusicSelectionState): Chart => {
    // Workaround by https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25758#issuecomment-580690247
    const chart = _.find(charts, { file: state.selectedChartId as any })
    if (chart) return chart
    return _.minBy(charts, (chart) =>
      Math.abs(getChartLevel(chart) - state.selectedChartLevel)
    )!
  }

// Updater
export const selectSong = (songId: string) =>
  produce((draft: Draft<MusicSelectionState>) => {
    draft.selectedSongId = songId
  })
export const selectChart = (
  songId: string,
  chartId: string,
  chartLevel: number
) =>
  produce((draft: Draft<MusicSelectionState>) => {
    draft.selectedSongId = songId
    draft.selectedChartId = chartId
    draft.selectedChartLevel = chartLevel
  })

// Utilities
export function getChartLevel(chart: ChartProps): number {
  return chart.info.level + (chart.info.difficulty === 5 ? 1000 : 0)
}

export const musicSelectionSlice = createSlice({
  name: 'musicSelection',
  initialState,
  reducers: {
    CUSTOM_SONG_LOADED: (
      state,
      { payload: { song } }: PayloadAction<{ song: SongMetadataInCollection }>
    ) => selectSong(song.id)(state),
    MUSIC_SONG_SELECTED: (
      state,
      { payload: { songId } }: PayloadAction<{ songId: string }>
    ) => selectSong(songId)(state),
    MUSIC_CHART_SELECTED: (
      state,
      {
        payload: { songId, chartId, chartLevel },
      }: PayloadAction<{ songId: string; chartId: string; chartLevel: number }>
    ) => selectChart(songId, chartId, chartLevel)(state),
  },
})
