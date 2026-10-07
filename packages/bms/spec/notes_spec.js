const { Compiler, Notes } = require('../lib')
const { expect } = require('chai')

describe('Notes', function () {
  it('should be able to process normal notes', function () {
    const chart = Compiler.compile('#00111:01020300').chart
    const notes = Notes.fromBMSChart(chart)
    expect(notes.all()).to.have.length(3)
  })

  it('should be able to process long notes', function () {
    const chart = Compiler.compile('#00151:01010202').chart
    const notes = Notes.fromBMSChart(chart)
    expect(notes.all()).to.have.length(2)
  })

  it('should assign correct column to long notes', function () {
    const chart = Compiler.compile('#00156:01010000').chart
    const notes = Notes.fromBMSChart(chart)
    expect(notes.all()).to.have.length(1)
    expect(notes.all()[0].column).to.equal('SC')
  })

  it('should be able to process autokeysounds', function () {
    const chart = Compiler.compile('#00101:01020300').chart
    const notes = Notes.fromBMSChart(chart)
    expect(notes.all()).to.have.length(3)
  })

  it('should be able to process dtx format', function () {
    const chart = Compiler.compile('#00101: 01020300', { format: 'dtx' }).chart
    const notes = Notes.fromBMSChart(chart)
    expect(notes.all()).to.have.length(3)
  })

  describe('LNOBJ', function () {
    it('should fold case in base-36 charts (default)', function () {
      // The trailing `aa` matches `#LNOBJ AA` case-insensitively, so it
      // terminates the `0B` note instead of creating a new one.
      const chart = Compiler.compile('#LNOBJ AA\n#00111:0Baa').chart
      const notes = Notes.fromBMSChart(chart)
      expect(notes.all()).to.have.length(1)
      expect(notes.all()[0].endBeat).to.not.equal(undefined)
    })

    describe('with #BASE 62', function () {
      it('should terminate a note only on an exact-case match', function () {
        const chart = Compiler.compile('#BASE 62\n#LNOBJ AA\n#00111:0BAA').chart
        const notes = Notes.fromBMSChart(chart)
        expect(notes.all()).to.have.length(1)
        expect(notes.all()[0].endBeat).to.not.equal(undefined)
      })

      it('should not terminate a note on a differently-cased ID', function () {
        const chart = Compiler.compile('#BASE 62\n#LNOBJ AA\n#00111:0Baa').chart
        const notes = Notes.fromBMSChart(chart)
        expect(notes.all()).to.have.length(2)
      })
    })
  })

  describe('custom mapping', function () {
    it('allows custom mapping', function () {
      const chart = Compiler.compile('#00112:01').chart
      const notes = Notes.fromBMSChart(chart, { mapping: { 12: 'A' } })
      expect(notes.all()[0].column).to.equal('A')
    })

    it('works with long notes', function () {
      const chart = Compiler.compile('#00152:0101').chart
      const notes = Notes.fromBMSChart(chart, { mapping: { 12: 'A' } })
      expect(notes.all()[0].column).to.equal('A')
    })

    it('works with two players', function () {
      const chart = Compiler.compile('#00162:0101').chart
      const notes = Notes.fromBMSChart(chart, { mapping: { 22: 'A' } })
      expect(notes.all()[0].column).to.equal('A')
    })
  })
})
