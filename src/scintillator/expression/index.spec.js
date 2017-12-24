import Expression from 'bemuse/scintillator/expression'

describe('Scintillator Expression', function () {
  describe('()', function () {
    it('should parse', function () {
      var f = new Expression('a+b')
      expect(f({ a: 1, b: 5 })).to.equal(6)
    })
  })
  describe('#constant', function () {
    it('should be false when containing variables', function () {
      var f = new Expression('a+b')
      void expect(f.constant).to.be.false
    })
    it('should be true when only contains number', function () {
      var f = new Expression('-1.25')
      void expect(f.constant).to.be.true
    })
  })
})
