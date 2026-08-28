const { Reader, Compiler, Keysounds, Notes } = require('../lib')
const fs = require('fs')
const path = require('path')
const { expect } = require('chai')

function fixture(name) {
  return fs.readFileSync(path.resolve(__dirname, 'fixtures/' + name))
}

describe('base62 keysound IDs (#BASE 62)', function () {
  function loadFixture() {
    const source = Reader.read(fixture('base62.bms'))
    return Compiler.compile(source).chart
  }

  it('should expose the chart base', function () {
    expect(loadFixture().base).to.equal(62)
    expect(Compiler.compile('#TITLE hi').chart.base).to.equal(36)
  })

  it('should keep differently-cased WAV ids distinct end-to-end', function () {
    const keysounds = Keysounds.fromBMSChart(loadFixture())
    expect(keysounds.get('Aa')).to.equal('lower.wav')
    expect(keysounds.get('AA')).to.equal('upper.wav')
    expect(keysounds.get('aA')).to.equal('mixed.wav')
  })

  it('should preserve object value case so notes reference distinct sounds', function () {
    const chart = loadFixture()
    const notes = Notes.fromBMSChart(chart)
    const keysounds = Keysounds.fromBMSChart(chart)
    // Channel data `AaAAaA` => three notes referencing Aa, AA, aA.
    const filenames = notes.all().map((note) => keysounds.get(note.keysound))
    expect(filenames).to.deep.equal(['lower.wav', 'upper.wav', 'mixed.wav'])
  })
})
