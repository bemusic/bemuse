
import AudioLoader from 'bemuse/game/audio-loader'

describe('AudioLoader', function() {

  describe('load', function() {

    var assets
    var keysounds
    var master
    var loader

    beforeEach(function() {
      assets    = { file: sinon.stub() }
      keysounds = { files: sinon.stub() }
      master    = { sample: sinon.stub() }
      loader = new AudioLoader(assets, master)
    })

    it('should load file when matches', function() {
      keysounds.files.returns(['a.wav'])
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.resolve('ok2'))
      return expect(loader.loadFrom(keysounds)).to.eventually.deep.eq({
        'a.wav': 'ok2'
      })
    })

    it('should try mp3', function() {
      keysounds.files.returns(['a.wav'])
      assets.file.withArgs('a.wav').returns(Promise.reject())
      assets.file.withArgs('a.mp3').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.resolve('ok2'))
      return expect(loader.loadFrom(keysounds)).to.eventually.deep.eq({
        'a.wav': 'ok2'
      })
    })

    it('should not include failed matches', function() {
      keysounds.files.returns(['a.wav'])
      assets.file.withArgs('a.wav').returns(Promise.reject())
      assets.file.withArgs('a.mp3').returns(Promise.reject())
      return expect(loader.loadFrom(keysounds)).to.eventually.deep.eq({ })
    })

  })

})
