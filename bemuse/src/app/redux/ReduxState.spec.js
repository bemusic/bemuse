import {
  collectionsSlice,
  selectSelectedChart,
  selectSelectedSong,
} from './ReduxState'

import configureStore from './configureStore'
import { optionsSlice } from '../entities/Options'

describe('ReduxState', function () {
  describe('integration test', function () {
    const store = configureStore()
    store.dispatch(
      collectionsSlice.actions.COLLECTION_LOADING_BEGAN({
        url: '/music',
      })
    )
    store.dispatch(
      optionsSlice.actions.LOADED_FROM_STORAGE({
        options: {
          'player.P1.mode': 'BM',
          'player.P1.scratch': 'left',
        },
      })
    )
    store.dispatch(
      collectionsSlice.actions.COLLECTION_LOADED({
        url: '/music',
        data: {
          songs: [
            {
              title: 'Exargon',
              id: 'exargon',
              charts: [
                {
                  keys: '7K',
                  file: 'exargon_7another.bms',
                  info: { level: 12 },
                },
                {
                  keys: '7K',
                  file: 'exargon_7hyper.bms',
                  info: { level: 10 },
                },
                {
                  keys: '7K',
                  file: 'exargon_7normal.bms',
                  info: { level: 8 },
                },
              ],
            },
            {
              title: 'Anhedonia',
              id: 'anhedonia',
              charts: [
                {
                  keys: '7K',
                  file: '01_anhedonia_n.bms',
                  info: { level: 6 },
                },
                {
                  keys: '7K',
                  file: '00_anhedonia_7b.bms',
                  info: { level: 1 },
                },
              ],
            },
            {
              title: 'Blooming',
              id: 'blooming',
              charts: [
                {
                  keys: '7K',
                  file: 'Trish_Blooming_7key_Another.bms',
                  info: { level: 11 },
                },
                {
                  keys: '7K',
                  file: 'Trish_Blooming_7key_Feeling.bms',
                  info: { level: 13 },
                },
              ],
            },
          ],
        },
      })
    )

    it('should intially selected easiest song and chart', () => {
      const state = store.getState()
      expect(selectSelectedSong(state).title).to.equal('Anhedonia')
      expect(selectSelectedChart(state).file).to.equal('00_anhedonia_7b.bms')
    })
  })
})
