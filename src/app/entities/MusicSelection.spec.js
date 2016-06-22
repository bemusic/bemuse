import * as MusicSelection from './MusicSelection'
import { given, shouldEqual } from 'circumstance'

describe('MusicSelection', function () {
  it('allows selecting song', () =>
    given(MusicSelection.initialState)
    .when(MusicSelection.selectSong('song1'))
    .then(
      MusicSelection.selectedSongGivenSongs([
        { id: 'song0', title: 'TEST' },
        { id: 'song1', title: 'BY MY SIDE' }
      ]),
      shouldEqual({ id: 'song1', title: 'BY MY SIDE' })
    )
  )
  it('should fallback to avilaable song if not available', () =>
    given(MusicSelection.initialState)
    .when(MusicSelection.selectSong('song1'))
    .then(
      MusicSelection.selectedSongGivenSongs([
        { id: 'song0', title: 'TEST' },
        { id: 'song2', title: 'RUNNING OUT' }
      ]),
      shouldEqual({ id: 'song0', title: 'TEST' })
    )
  )
  it('should allow selecting chart', () =>
    given(MusicSelection.initialState)
    .when(MusicSelection.selectChart('song1', 'chart1.bml', 8))
    .then((state) => state.selectedSongId, shouldEqual('song1'))
    .and((state) => state.selectedChartId, shouldEqual('chart1.bml'))
    .and((state) => state.selectedChartLevel, shouldEqual(8))
  )

  const givenSelectedChart = (
    given(MusicSelection.initialState)
    .and(MusicSelection.selectChart('song1', 'chart1.bml', 8))
  )
  it('selects the chart if available', () =>
    givenSelectedChart
    .then(
      MusicSelection.selectedChartGivenCharts([
        { file: 'chart0.bml', info: { level: 1 } },
        { file: 'chart1.bml', info: { level: 8 } },
        { file: 'chart2.bml', info: { level: 12 } },
      ]),
      shouldEqual({ file: 'chart1.bml', info: { level: 8 } })
    )
  )
  it('selects chart with closest level if matching chart not available', () =>
    givenSelectedChart
    .then(
      MusicSelection.selectedChartGivenCharts([
        { file: 'pattern0.bml', info: { level: 2 } },
        { file: 'pattern1.bml', info: { level: 9 } },
        { file: 'pattern2.bml', info: { level: 10 } },
      ]),
      shouldEqual({ file: 'pattern1.bml', info: { level: 9 } })
    )
  )
})
