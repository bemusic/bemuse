
var def = require('./def')

module.exports = def(function(World, Given, When, Then) {

  Given(/^a BMS file as follows$/, function (string) {
    this.parseBMS(string)
  })

  Then(/^there should be (\d+) header sentences?$/, function (n) {
    expect(this.result.headerSentences).to.equal(+n)
  })

  Then(/^there should be (\d+) channel sentences?$/, function (n) {
    expect(this.result.channelSentences).to.equal(+n)
  })

  Then(/^the header "([^"]*)" should have value "([^"]*)"$/, function (name, value) {
    expect(this.chart.headers.get(name)).to.equal(value)
  })

  Then(/^there should be (\d+) objects$/, function (n) {
    expect(this.chart.objects.all()).to.have.length(+n)
  })

  Then(/^object (\S+) should be on channel (\S+) at beat (\d+)$/, function (value, channel, beat) {
    var object      = this.getObject(value)
    var objectBeat  = this.chart.measureToBeat(object.measure, object.fraction)
    expect(object.channel).to.equal(channel)
    expect(objectBeat).to.equal(+beat)
  })

  Then(/^object (\S+) should be at beat ([\d\.]+)$/, function (value, beat) {
    var object      = this.getObject(value)
    var objectBeat  = this.chart.measureToBeat(object.measure, object.fraction)
    expect(objectBeat).to.equal(+beat)
  })

  Then(/^object (\S+) should be at ([\d\.]+) seconds?$/, function (value, seconds) {
    var object        = this.getObject(value)
    var objectBeat    = this.chart.measureToBeat(object.measure, object.fraction)
    var objectSeconds = this.timing.beatToSeconds(objectBeat)
    expect(objectSeconds).to.be.closeTo(+seconds, 1e-3)
  })

  Then(/^there should be (\d+) playable notes?$/, function (n, seconds) {
    expect(this.notes.count()).to.equal(+n)
  })

  Then(/^object (\S+) should be a long note from beat ([\d\.]+) to ([\d\.]+)$/, function (value, a, b, seconds) {
    var note = this.getNote(value)
    expect(note.beat).to.equal(+a)
    expect(note.endBeat).to.equal(+b)
  })

})

