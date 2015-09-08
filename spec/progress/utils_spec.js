
import Progress from 'bemuse/progress'
import * as ProgressUtils from 'bemuse/progress/utils'

describe('ProgressUtils', function() {

  describe('.fixed', function() {
    it('should report for fixed number of items', function() {
      let progress = new Progress()
      let advance = ProgressUtils.fixed(10, progress)
      expect(progress.current).to.equal(0)
      expect(progress.total).to.equal(10)
      advance('wow')
      expect(progress.current).to.equal(1)
      expect(progress.total).to.equal(10)
      expect(progress.extra).to.equal('wow')
    })
  })

  describe('.wrapPromise', function() {
    it('should report number of fulfilled promises', function() {
      let progress = new Progress()
      let f = ProgressUtils.wrapPromise(progress, promise => promise)
      let a = f(new Promise(() => {}))
      let b = f(Promise.resolve(1))
      let c = f(Promise.reject(new Error('no')))
      let d = f(Promise.resolve(3))
      void a
      void c
      return Promise.all([b, d]).then(() => {
        expect(progress.current).to.equal(2)
        expect(progress.total).to.equal(4)
      })
    })
  })

  describe('.bind', function() {
    it('should bind from one progress to another', function() {
      let a = new Progress()
      let b = new Progress()
      a.report(10, 20)
      ProgressUtils.bind(a, b)
      expect(b.current).to.equal(10)
      expect(b.total).to.equal(20)
      a.report(15, 25)
      expect(b.current).to.equal(15)
      expect(b.total).to.equal(25)
    })
  })

  describe('.simultaneous', function () {
    it('should report in fifo manner', function () {
      let out = new Progress()
      let simultaneous = ProgressUtils.simultaneous(out)
      let a = new Progress()
      let b = new Progress()
      simultaneous.add(a)
      a.report(10, 20)
      expect(out.current).to.equal(10)
      simultaneous.add(b)
      b.report(11, 30)
      expect(out.current).to.equal(10)
      a.report(15, 20)
      expect(out.current).to.equal(15)
      a.report(20, 20)
      expect(out.current).to.equal(11)
      b.report(21, 30)
      expect(out.current).to.equal(21)
      b.report(30, 30)
      expect(out.current).to.equal(30)
      expect(out.total).to.equal(30)
    })
  })

})
