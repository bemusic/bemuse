
var steps = require('artstep')

module.exports = (steps()

  .Then(/^there should be (\d+) playable notes?$/, function (n) {
    expect(this.notes.count()).to.equal(+n)
  })

  .Then(/^object (\S+) should be a long note from beat ([\d\.]+) to ([\d\.]+)$/, function (value, a, b) {
    var note = this.getNote(value)
    expect(note.beat).to.equal(+a)
    expect(note.endBeat).to.equal(+b)
  })

)
