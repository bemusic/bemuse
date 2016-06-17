
import SamplesLoader  from './samples-loader'

describe('SamplesLoader', function () {

  var assets
  var master
  var loader

  beforeEach(function () {
    assets    = { file: sinon.stub() }
    master    = { sample: sinon.stub() }
    loader = new SamplesLoader(assets, master)
  })

  describe('#loadFiles', function () {

    it('should not include undecodable audio', function () {
      assets.file.returns(Promise.reject())
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.reject(new Error('..')))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({ })
    })

    it('should try mp3', function () {
      assets.file.returns(Promise.reject())
      assets.file.withArgs('a.mp3').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.sample.withArgs('ok1').returns(Promise.resolve('ok2'))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({
        'a.wav': 'ok2'
      })
    })

    it('should not include failed matches', function () {
      assets.file.returns(Promise.reject())
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({ })
    })

  })

})
