
import SamplesLoader  from 'bemuse/game/loaders/samples-loader'
import BMS            from 'bms'
import Progress       from 'bemuse/progress'

function chart(code) {
  return BMS.Compiler.compile(code).chart
}

describe('SamplesLoader', function() {

  var assets
  var master
  var loader

  beforeEach(function() {
    assets    = { file: sinon.stub() }
    master    = { sample: sinon.stub() }
    loader = new SamplesLoader(assets, master)
  })

  describe('#loadFromBMSChart', function() {
    it('should load from a BMSChart', function() {
      let c       = chart('#WAV01 a.wav\n#WAV02 a.wav')
      let pLoad   = new Progress()
      let pDecode = new Progress()
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.resolve('ok2'))
      return expect(loader.loadFromBMSChart(c, pLoad, pDecode))
          .to.eventually.deep.eq({ 'a.wav': 'ok2' })
    })
  })

  describe('#loadFiles', function() {

    it('should load file when matches', function() {
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.resolve('ok2'))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({
        'a.wav': 'ok2'
      })
    })

    it('should not include undecodable audio', function() {
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.reject(new Error('..')))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({ })
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
      assets.file.withArgs('a.ogg').returns(Promise.reject())
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({ })
    })

  })

})
