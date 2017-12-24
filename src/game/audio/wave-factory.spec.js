
import WaveFactory from './wave-factory'

function k (id) {
  return { keysound: id }
}

describe('WaveFactory', function () {
  let master
  let sample
  let samples
  let map
  let waveFactory
  beforeEach(function () {
    master = { group: sinon.stub() }
    sample = { play: sinon.stub() }
    samples = { 'wow.wav': sample }
    map = { '0z': 'wow.wav' }
    waveFactory = new WaveFactory(master, samples, map)
  })
  describe('playAuto', function () {
    it('should play an autokeysound', function () {
      waveFactory.playAuto(k('0z'), 0.1)
      expect(sample.play).to.have.been.calledWith(0.1)
    })
  })
  describe('playNote', function () {
    it('should play the keysound', function () {
      waveFactory.playNote(k('0z'), 0.1)
      expect(sample.play).to.have.been.calledWith(0.1)
    })
    it('should stop old sound', function () {
      let instance = { stop: sinon.spy() }
      sample.play.returns(instance)
      waveFactory.playNote(k('0z'), 0)
      waveFactory.playNote(k('0z'), 0)
      return Promise.delay(0).then(() =>
        expect(instance.stop).to.have.callCount(1))
    })
  })
  describe('playFree', function () {
    it('should play the keysound', function () {
      waveFactory.playFree(k('0z'))
      void expect(sample.play).to.have.been.called
    })
  })
})
