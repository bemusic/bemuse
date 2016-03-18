
/*global AudioContext, WebAudioTestAPI*/
import SamplingMaster, { FADE_LENGTH } from 'bemuse/sampling-master'
import 'web-audio-test-api'

describe('SamplingMaster', function () {

  let context
  let master
  before(() => { WebAudioTestAPI.use() })
  beforeEach(() => {
    context = new AudioContext()
    master  = new SamplingMaster(context)
  })

  describe('#unmute', function () {
    it('unmutes the audio', function () {
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

  describe('#group', function () {
    it('has a destination with gain', function () {
      const group = master.group({ volume: 0.5 })
      expect(group.destination.gain.value).to.equal(0.5)
    })
    it('connect upon construct, disconnect upon destroy', function () {
      const group = master.group()
      const node = group.destination
      void expect(node.$isConnectedTo(master.destination)).to.be.true
      group.destroy()
      void expect(node.$isConnectedTo(master.destination)).to.be.false
      void expect(group.destination).to.be.null
    })
  })

  describe('#sample', function () {
    it('should coerce blob', function () {
      return master.sample(new Blob([]))
    })
    it('should coerce array buffer', function () {
      return master.sample(new ArrayBuffer(0))
    })
    it('should reject when decoding failed', function () {
      context.DECODE_AUDIO_DATA_FAILED = true
      return expect(master.sample(new ArrayBuffer(0))
        .finally(() => (context.DECODE_AUDIO_DATA_FAILED = false)))
          .to.be.rejected
    })
    describe('#play', function () {
      let sample
      let bufferSource
      let buffer
      beforeEach(function () {
        bufferSource = context.createBufferSource()
        buffer = context.createBuffer(1, 44100, 44100)
        bufferSource.buffer = buffer
        sinon.stub(context, 'createBufferSource').returns(bufferSource)
        sinon.spy(bufferSource, 'start')
        return master.sample(new Blob([])).then(s => (sample = s))
      })
      it('should play a buffer source', function () {
        sample.play()
        void expect(context.createBufferSource).to.have.been.called
        expect(bufferSource.start).to.have.been.calledWith(0)
      })
      it('should play a buffer source with delay', function () {
        context.$processTo(1)
        sample.play(20)
        void expect(context.createBufferSource).to.have.been.called
        expect(bufferSource.start).to.have.been.calledWith(21)
      })
      it('should play a buffer slice (without end)', function () {
        sample.play(0, { start: 1, end: undefined })
        expect(bufferSource.start).to.have.been.calledWith(0, 1)
      })
      it('should play a buffer slice (with end)', function () {
        sample.play(0, { start: 1, end: 3 })
        expect(bufferSource.start).to.have.been.calledWith(0, 1, 2 + FADE_LENGTH)
      })
      it('should play to a group', function () {
        const group = master.group()
        const instance = sample.play(0, { group })
        void expect(instance.TEST_node.$isConnectedTo(group.destination)).to.be.true
      })

      // HACK: only enable this test case when Event#type can be set after
      // being constructed. If this isn't true, WebAudioTestAPI will cause
      // an error due to how its own Event is implemented.
      // https://github.com/mohayonao/web-audio-test-api/issues/18
      void (function () {
        try {
          new Event('wat').type = 'customevent'
          return it
        } catch (e) {
          void e
          return it.skip
        }
      }())('should call #stop when playing finished', function () {
        let instance = sample.play()
        sinon.spy(instance, 'stop')
        context.$processTo(1.5)
        void expect(instance.stop).to.have.been.called
      })

      describe('#stop', function () {
        it('should stop the buffer source', function () {
          let instance = sample.play()
          sinon.spy(bufferSource, 'stop')
          instance.stop()
          void expect(bufferSource.stop).to.have.been.called
        })
        it('can be called multiple times', function () {
          let instance = sample.play()
          sinon.spy(bufferSource, 'stop')
          instance.stop()
          instance.stop()
          instance.stop()
          void expect(bufferSource.stop).to.have.been.calledOnce
        })
        it('should call #onstop', function () {
          let instance = sample.play()
          instance.onstop = sinon.spy()
          instance.stop()
          void expect(instance.onstop).to.have.been.called
        })
      })

      describe('#bad', function () {
        it('should change pitch of sound', function () {
          let instance = sample.play()
          instance.bad()
          expect(bufferSource.playbackRate.value).not.to.equal(1)
        })
      })
    })
  })

  describe('#destroy', function () {
    let sample
    beforeEach(function () {
      return master.sample(new Blob([])).then(s => (sample = s))
    })
    it('should stop all samples', function () {
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
    it('can no longer create samples', function () {
      master.destroy()
      return expect(master.sample(new Blob([]))).to.be.rejected
    })
    it('only destroys once', function () {
      let a = sample.play()
      sinon.spy(a, 'destroy')
      master.destroy()
      master.destroy()
      expect(a.destroy).to.have.callCount(1)
    })
  })

  after(() => { WebAudioTestAPI.unuse() })

})
