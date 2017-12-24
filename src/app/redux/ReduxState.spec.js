import * as ReduxState from './ReduxState'
import { given, shouldEqual, withReducer } from 'circumstance'

const { dispatch, initialState } = withReducer(ReduxState.reducer)

describe('ReduxState', function () {
  describe('integration test', function () {
    const givenLoadedCollection = (
      given(initialState)
        .and(dispatch({
          type: ReduxState.COLLECTION_LOADING_BEGAN,
          url: '/music'
        }))
        .and(dispatch({
          type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
          options: {
            'player.P1.mode': 'BM',
            'player.P1.scratch': 'left'
          }
        }))
        .and(dispatch({
          type: ReduxState.COLLECTION_LOADED,
          url: '/music',
          data: {
            songs: [
              { title: 'Exargon',
                id: 'exargon',
                charts: [
                  { keys: '7K', file: 'exargon_7another.bms', info: { level: 12 } },
                  { keys: '7K', file: 'exargon_7hyper.bms', info: { level: 10 } },
                  { keys: '7K', file: 'exargon_7normal.bms', info: { level: 8 } }
                ] },
              { title: 'Anhedonia',
                id: 'anhedonia',
                charts: [
                  { keys: '7K', file: '01_anhedonia_n.bms', info: { level: 6 } },
                  { keys: '7K', file: '00_anhedonia_7b.bms', info: { level: 1 } }
                ] },
              { title: 'Blooming',
                id: 'blooming',
                charts: [
                  { keys: '7K', file: 'Trish_Blooming_7key_Another.bms', info: { level: 11 } },
                  { keys: '7K', file: 'Trish_Blooming_7key_Feeling.bms', info: { level: 13 } }
                ] }
            ]
          }
        }))
    )
    it('should intially selected easiest song and chart', () =>
      givenLoadedCollection
        .then(
          ReduxState.selectSelectedSong,
          (song) => song.title,
          shouldEqual('Anhedonia')
        )
        .and(
          ReduxState.selectSelectedChart,
          (chart) => chart.file,
          shouldEqual('00_anhedonia_7b.bms')
        )
    )
  })
})
