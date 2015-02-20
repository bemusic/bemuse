
import SamplesLoader from 'bemuse/game/samples-loader'

describe('SamplesLoader', function() {

  describe('#loadFiles', function() {

    var assets
    var master
    var loader

    beforeEach(function() {
      assets    = { file: sinon.stub() }
      master    = { sample: sinon.stub() }
      loader = new SamplesLoader(assets, master)
    })

    it('should load file when matches', function() {
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.resolve('ok2'))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({
        'a.wav': 'ok2'
      })
    })

    it('should try mp3', function() {
      assets.file.withArgs('a.wav').returns(Promise.reject())
      assets.file.withArgs('a.mp3').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.resolve('ok2'))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({
        'a.wav': 'ok2'
      })
    })

    it('should not include failed matches', function() {
      assets.file.withArgs('a.wav').returns(Promise.reject())
      assets.file.withArgs('a.mp3').returns(Promise.reject())
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({ })
    })

  })

})
