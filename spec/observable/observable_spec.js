
import Observable from 'bemuse/observable'

describe('Observable', function() {

  describe('stateless mode', function() {

    it('should call watchers', function() {
      let s1 = sinon.spy()
      let s2 = sinon.spy()
      let o = new Observable()
      let u = o.watch(s1)
      void expect(s1).not.to.have.been.called
      o.notify('1')
      expect(s1).to.have.been.calledWith('1')
      o.watch(s2)
      void expect(s2).not.to.have.been.called
      o.notify('2')
      expect(s1).to.have.been.calledWith('2')
      expect(s2).to.have.been.calledWith('2')
      u()
      o.notify('3')
      expect(s1).not.to.have.been.calledWith('3')
      expect(s2).to.have.been.calledWith('3')
    })

  })

  describe('stateful mode', function() {

    it('should have value', function() {
      let o = new Observable('0')
      expect(o.value).to.equal('0')
    })

    it('should call watchers', function() {
      let s1 = sinon.spy()
      let s2 = sinon.spy()
      let o = new Observable('0')
      let u = o.watch(s1)
      expect(s1).to.have.been.calledWith('0')
      o.value = '1'
      expect(s1).to.have.been.calledWith('1')
      o.watch(s2)
      expect(s2).to.have.been.calledWith('1')
      o.value = '2'
      expect(s1).to.have.been.calledWith('2')
      expect(s2).to.have.been.calledWith('2')
      u()
      o.value = '3'
      expect(s1).not.to.have.been.calledWith('3')
      expect(s2).to.have.been.calledWith('3')
    })

  })

})
