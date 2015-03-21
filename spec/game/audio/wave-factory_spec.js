
import WaveFactory from 'bemuse/game/audio/wave-factory'

describe('WaveFactory', function() {
  let master
  let sample
  let samples
  let map
  let waveFactory
  beforeEach(function() {
    master  = { }
    sample  = { play: sinon.stub() }
    samples = { 'wow.wav': sample }
    map     = { '0z': 'wow.wav' }
    waveFactory = new WaveFactory(master, samples, map)
  })
  describe('playAuto', function() {
    it('should play an autokeysound', function() {
      waveFactory.playAuto('0z', 0.1)
      expect(sample.play).to.have.been.calledWith(0.1)
    })
  })
  describe('playNote', function() {
    it('should play the keysound', function() {
      waveFactory.playNote('0z', 0.1)
      expect(sample.play).to.have.been.calledWith(0.1)
    })
    it('should stop old sound', function() {
      let instance = { stop: sinon.spy() }
      sample.play.returns(instance)
      waveFactory.playNote('0z', 0)
      waveFactory.playNote('0z', 0)
      expect(instance.stop).to.have.callCount(1)
    })
  })
  describe('playFree', function() {
    it('should play the keysound', function() {
      waveFactory.playFree('0z')
      void expect(sample.play).to.have.been.called
    })
  })
})
