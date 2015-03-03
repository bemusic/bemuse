
import WaveFactory from 'bemuse/game/audio/wave-factory'

describe('WaveFactory', function() {
  describe('playAuto', function() {
    it('should play an autokeysound', function() {
      let master  = { }
      let sample  = { play: sinon.spy() }
      let samples = { 'wow.wav': sample }
      let map     = { '0z': 'wow.wav' }
      let waveFactory = new WaveFactory(master, samples, map)
      waveFactory.playAuto('0z')
      void expect(sample.play).to.have.been.called
    })
  })
})
