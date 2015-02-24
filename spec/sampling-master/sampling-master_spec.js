
import SamplingMaster from 'bemuse/sampling-master'
import 'web-audio-test-api'

describe('SamplingMaster', function() {

  let context
  let master
  before(() => { WebAudioTestAPI.use() })
  beforeEach(() => {
    context = new AudioContext()
    master  = new SamplingMaster(context)
  })

  describe('#unmute', function() {
    it('unmutes the audio', function() {
      let gain = context.createGain()
      sinon.stub(context, 'createGain').returns(gain)
      sinon.spy(gain, 'connect')
      sinon.spy(gain, 'disconnect')
      master.unmute()
      void expect(context.createGain).to.have.been.called
      void expect(gain.connect).to.have.been.called
      void expect(gain.disconnect).to.have.been.called
    })
  })

  describe('#sample', function() {
    it('should coerce blob', function() {
      return master.sample(new Blob([]))
    })
    it('should coerce array buffer', function() {
      return master.sample(new ArrayBuffer(0))
    })
    it('should reject when decoding failed', function() {
      context.DECODE_AUDIO_DATA_FAILED = true
      return expect(master.sample(new ArrayBuffer(0))
        .finally(() => context.DECODE_AUDIO_DATA_FAILED = false))
          .to.be.rejected
    })
    describe('#play', function() {
      let sample
      let bufferSource
      beforeEach(function() {
        bufferSource = context.createBufferSource()
        sinon.stub(context, 'createBufferSource').returns(bufferSource)
        sinon.spy(bufferSource, 'start')
        return master.sample(new Blob([])).then(s => sample = s)
      })
      it('should play a buffer source', function() {
        sample.play()
        void expect(context.createBufferSource).to.have.been.called
        expect(bufferSource.start).to.have.been.calledWith(0)
      })
      it('should play a buffer source with delay', function() {
        context.$processTo(1)
        sample.play(20)
        void expect(context.createBufferSource).to.have.been.called
        expect(bufferSource.start).to.have.been.calledWith(21)
      })
      describe('#stop', function() {
        it('should stop the buffer source', function() {
          let instance = sample.play()
          sinon.spy(bufferSource, 'stop')
          instance.stop()
          void expect(bufferSource.stop).to.have.been.called
        })
      })
    })
  })

  describe('#destroy', function() {
    let sample
    beforeEach(function() {
      return master.sample(new Blob([])).then(s => sample = s)
    })
    it('should stop all samples', function() {
      let a = sample.play()
      let b = sample.play()
      let c = sample.play()
      sinon.spy(a, 'stop')
      sinon.spy(b, 'stop')
      sinon.spy(c, 'stop')
      master.destroy()
      void expect(a.stop).to.have.been.called
      void expect(b.stop).to.have.been.called
      void expect(c.stop).to.have.been.called
    })
    it('can no longer create samples', function() {
      master.destroy()
      return expect(master.sample(new Blob([]))).to.be.rejected
    })
    it('only destroys once', function() {
      let a = sample.play()
      sinon.spy(a, 'destroy')
      master.destroy()
      master.destroy()
      expect(a.destroy).to.have.callCount(1)
    })
  })

  after(() => { WebAudioTestAPI.unuse() })

})

