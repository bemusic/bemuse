import assert from 'power-assert'

import SamplesLoader  from './samples-loader'

describe('SamplesLoader', function () {

  var assets
  var master
  var loader
  var keysoundCache

  beforeEach(function () {
    assets = { file: sinon.stub() }
    master = { decode: sinon.stub(), sample: sinon.stub() }
    keysoundCache = { isCached: () => false, cache: sinon.spy(() => { }) }
    loader = new SamplesLoader(assets, master, { keysoundCache })
  })

  describe('#loadFiles', function () {
    it('should not include undecodable audio', function () {
      assets.file.returns(Promise.reject())
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.decode.withArgs('ok1').returns(Promise.reject(new Error('..')))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({ })
    })

    it('should cache', function () {
      assets.file.returns(Promise.reject())
      assets.file.withArgs('a.wav').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.decode.withArgs('ok1').returns(Promise.resolve('ok2'))
      master.sample.withArgs('ok2').returns(Promise.resolve('ok3'))
      return loader.loadFiles([ 'a.wav' ]).then(() => {
        assert(keysoundCache.cache.calledOnce)
        assert(keysoundCache.cache.calledWith('a.wav', 'ok2'))
      })
    })

    it('should use cache', function () {
      assets.file.returns(Promise.reject())
      keysoundCache.isCached = (name) => name === 'name.wav'
      keysoundCache.get = (name) => {
        if (name === 'name.wav') return 'buffer'
        throw new Error('expected name.wav')
      }
      master.sample.withArgs('buffer').returns(Promise.resolve('sample'))
      return expect(loader.loadFiles([ 'name.wav' ])).to.eventually.deep.eq({
        'name.wav': 'sample'
      })
    })

    it('should try mp3', function () {
      assets.file.returns(Promise.reject())
      assets.file.withArgs('a.mp3').returns(Promise.resolve({
        read: () => Promise.resolve('ok1')
      }))
      master.decode.withArgs('ok1').returns(Promise.resolve('ok2'))
      master.sample.withArgs('ok2').returns(Promise.resolve('ok3'))
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({
        'a.wav': 'ok3'
      })
    })

    it('should not include failed matches', function () {
      assets.file.returns(Promise.reject())
      return expect(loader.loadFiles(['a.wav'])).to.eventually.deep.eq({ })
    })

  })

})
