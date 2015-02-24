
import Progress from 'bemuse/progress'

describe('Progress', function() {

  describe('#watch', function() {
    it('should report current progress when watched', function() {
      let progress = new Progress()
      let spy = sinon.spy()
      progress.report(1, 10)
      progress.watch(spy)
      expect(spy).to.have.callCount(1)
      expect(spy).to.have.been.calledWith(progress)
    })
  })

  describe('#toString', function() {
    it('should return blank string when no progress', function() {
      let progress = new Progress()
      expect(progress.toString()).to.equal('')
    })
    it('should return a string representation of the progress', function() {
      let progress = new Progress()
      progress.report(1, 10)
      expect(progress.toString()).to.equal('1 / 10')
    })
    it('should use a formatter', function() {
      let progress = new Progress()
      progress.report(1, 10)
      progress.formatter = (p) => p.progress + ''
      expect(progress.toString()).to.equal('0.1')
    })
  })

  describe('#report', function() {
    it('should fire to all watchers', function() {
      let progress = new Progress()
      let spy = sinon.spy()
      progress.report(1, 10)
      progress.report(2, 10)
      progress.watch(spy)
      progress.report(3, 10)
      progress.report(4, 10)
      expect(spy).to.have.callCount(3)
    })
    it('should return a function to unsubscribe', function() {
      let progress = new Progress()
      let spy = sinon.spy()
      progress.report(1, 10)
      progress.report(2, 10)
      let unsubscribe = progress.watch(spy)
      progress.report(3, 10)
      unsubscribe()
      progress.report(4, 10)
      expect(spy).to.have.callCount(2)
    })
  })

  describe('#progress', function() {
    it('returns progress in fraction', function() {
      let progress = new Progress()
      progress.report(1, 10)
      expect(progress.progress).to.equal(1 / 10)
    })
    it('returns null in unavailable', function() {
      let progress = new Progress()
      expect(progress.progress).to.equal(null)
    })
  })

})
