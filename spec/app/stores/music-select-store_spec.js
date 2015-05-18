
import $            from 'jquery'
import _            from 'lodash'
import co           from 'co'

import { MusicSelectStoreFactory }  from 'bemuse/app/stores/music-select-store'

import CollectionStore        from 'bemuse/app/stores/collection-store'
import * as CollectionActions from 'bemuse/app/actions/collection-actions'
import * as Actions           from 'bemuse/app/actions/music-select-actions'

describe('MusicSelectStore', function() {

  let Store
  let collection
  let url = '/spec/app/fixtures/index.json'

  before(co.wrap(function*() {
    collection = yield Promise.resolve($.get(url))
  }))

  beforeEach(function() {
    Store = MusicSelectStoreFactory(CollectionStore)
  })

  describe('during loading', function() {
    beforeEach(function() {
      CollectionActions.startLoading({ url: url })
    })
    it('loading should be true', function() {
      void expect(Store.get().loading).to.be.true
    })
    it('songs should be empty array', function() {
      expect(Store.get().songs).to.deep.equal([])
    })
  })

  describe('after loading', function() {
    beforeEach(function() {
      CollectionActions.startLoading({ url: url })
      CollectionActions.finishLoading(collection)
    })
    it('loading should be false', function() {
      void expect(Store.get().loading).to.be.false
    })
    describe('songs', function() {
      it('should be list of all songs', function() {
        expect(Store.get().songs).to.have.length(collection.songs.length)
      })
      it('first song should be tutorial', function() {
        void expect(!!Store.get().songs[0].tutorial).to.be.true
      })
      it('selected song should be tutorial', function() {
        void expect(!!Store.get().song.tutorial).to.be.true
      })
    })
    it('should select first matching song+chart when filtered', function() {
      Actions.setFilterText('toki')
      expect(Store.get().songs[0].title).to.equal('Toki')
      expect(Store.get().song).to.equal(Store.get().songs[0])
      expect(Store.get().chart.file).to.equal('toki_beginner7.bms')
    })
    it('should set song when selected', function() {
      Actions.selectSong(_.find(Store.get().songs, { title: 'mom' }))
      expect(Store.get().song.artist).to.equal('w_tre')
      expect(Store.get().chart.file).to.equal('mom_s1.bme')
    })
    it('should select and set chart with nearby level', function() {
      Actions.selectSong(_.find(Store.get().songs, { title: 'mom' }))
      Actions.selectChart(
          _.find(Store.get().song.charts, { file: 'mom_s4.bme' }))
      expect(Store.get().chart.info.level).to.equal(12)
      Actions.selectSong(_.find(Store.get().songs, { title: 'L' }))
      expect(Store.get().chart.file).to.equal('L_[SPA](XEIR).bme')
    })
    describe('groups', function() {
      it('there should be more than 1 group', function() {
        expect(Store.get().groups.length).to.be.at.least(2)
      })
      it('first group should be tutorial, having only one song', function() {
        expect(Store.get().groups[0].title).to.equal('Tutorial')
        expect(Store.get().groups[0].songs).to.have.length(1)
      })
      it('should eliminate empty groups', function() {
        Actions.setFilterText('wowwwwwwww')
        void expect(Store.get().groups).to.be.empty
      })
    })
    describe('custom songs', function() {
      beforeEach(function() {
        Actions.setCustomSong({
          id: 'meow',
          title: 'meow!',
          artist: 'lol',
          genre: 'keyboard cat',
          bpm: 123,
          custom: true,
          charts: [
            {
              file: '01.bme',
              md5: 'd41d8cd98f00b204e9800998ecf8427e',
              info: {
                title: 'meow!',
                artist: 'lol',
                genre: 'keyboard cat',
                difficulty: 2,
                level: 1,
              },
              noteCount: 1,
              scratch: true,
              keys: '7K'
            }
          ]
        })
      })
      it('should select the custom song', function() {
        expect(Store.get().song.id).to.equal('meow')
      })
      it('should display custom song at the top', function() {
        expect(Store.get().songs[0].id).to.equal('meow')
      })
    })
  })

})
