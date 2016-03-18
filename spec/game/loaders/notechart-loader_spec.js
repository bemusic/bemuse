
import NotechartLoader from 'bemuse/game/loaders/notechart-loader'

describe('NotechartLoader', function () {

  describe('with BMS file', function () {

    it('should be able to read', function () {

      let loader = new NotechartLoader()
      let buffer = new Buffer('#TITLE meow')
      let arraybuffer = buffer.buffer

      return loader.load(arraybuffer, { name: 'wow.bms' }, { }).then(notechart => {
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
      let arraybuffer = buffer.buffer

      return loader.load(arraybuffer, { name: 'wow.bmson' }, { }).then(notechart => {
        expect(notechart.songInfo.title).to.equal('Running Out')
      })
    })
  })
})
