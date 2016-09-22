
import NotechartLoader from '../src/loader'
import { expect } from 'chai'

describe('NotechartLoader', function () {
  describe('with BMS file', function () {
    it('should be able to read', function () {
      let loader = new NotechartLoader()
      let buffer = new Buffer(`#TITLE meow`)

      return loader.load(buffer, { name: 'wow.bms' }, { }).then(notechart => {
        expect(notechart.songInfo.title).to.equal('meow')
      })
    })
  })

  describe('with bmson file', function () {
    it('should be able to read', function () {
      let loader = new NotechartLoader()
      let data = {
        info: { title: 'Running Out' }
      }
      let buffer = new Buffer(JSON.stringify(data))

      return loader.load(buffer, { name: 'wow.bmson' }, { }).then(notechart => {
        expect(notechart.songInfo.title).to.equal('Running Out')
      })
    })
  })
})
