const { Keysounds, Compiler } = require('../lib')
const { expect } = require('chai')

describe('Keysounds', function () {
  describe('.fromBMSChart', function () {
    it('should map keysound IDs to filenames', function () {
      const chart = Compiler.compile('#WAVAA cat.wav\n#WAVBB dog.wav').chart
      const keysounds = Keysounds.fromBMSChart(chart)
      expect(keysounds.get('aa')).to.equal('cat.wav')
      expect(keysounds.get('bb')).to.equal('dog.wav')
    })

    it('should fold case in base-36 charts (default)', function () {
      const chart = Compiler.compile('#WAVAA cat.wav').chart
      const keysounds = Keysounds.fromBMSChart(chart)
      expect(keysounds.get('aa')).to.equal('cat.wav')
      expect(keysounds.get('AA')).to.equal('cat.wav')
      expect(keysounds.get('Aa')).to.equal('cat.wav')
    })

    it('should let a later definition override an earlier one (base 36)', function () {
      const chart = Compiler.compile('#WAVAA cat.wav\n#WAVaa dog.wav').chart
      const keysounds = Keysounds.fromBMSChart(chart)
      expect(keysounds.get('aa')).to.equal('dog.wav')
    })

    describe('with #BASE 62', function () {
      it('should treat differently-cased IDs as distinct keysounds', function () {
        const chart = Compiler.compile(
          '#BASE 62\n#WAVAa lower.wav\n#WAVAA upper.wav\n#WAVaA mixed.wav'
        ).chart
        const keysounds = Keysounds.fromBMSChart(chart)
        expect(keysounds.get('Aa')).to.equal('lower.wav')
        expect(keysounds.get('AA')).to.equal('upper.wav')
        expect(keysounds.get('aA')).to.equal('mixed.wav')
      })

      it('should be case-sensitive on lookup', function () {
        const chart = Compiler.compile('#BASE 62\n#WAVAa cat.wav').chart
        const keysounds = Keysounds.fromBMSChart(chart)
        expect(keysounds.get('Aa')).to.equal('cat.wav')
        expect(keysounds.get('AA')).to.equal(undefined)
        expect(keysounds.get('aa')).to.equal(undefined)
      })

      it('should work regardless of where #BASE appears', function () {
        const chart = Compiler.compile('#WAVAa cat.wav\n#BASE 62').chart
        const keysounds = Keysounds.fromBMSChart(chart)
        expect(keysounds.get('Aa')).to.equal('cat.wav')
        expect(keysounds.get('AA')).to.equal(undefined)
      })
    })
  })

  describe('#files', function () {
    it('should get list of all files', function () {
      expect(
        new Keysounds({
          AA: 'a.wav',
          BB: 'a.ogg',
          CC: 'a.wav',
        }).files()
      ).to.deep.equal(['a.wav', 'a.ogg'])
    })
  })

  describe('#all', function () {
    it('should return the keysound map', function () {
      expect(
        new Keysounds({
          AA: 'a.wav',
          BB: 'a.ogg',
          CC: 'a.wav',
        }).all()
      ).to.deep.equal({
        AA: 'a.wav',
        BB: 'a.ogg',
        CC: 'a.wav',
      })
    })
  })
})
