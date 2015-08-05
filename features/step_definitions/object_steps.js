
var steps = require('artstep')

module.exports = (steps()

  .Then(/^there should be (\d+) objects$/, function (n) {
    expect(this.chart.objects.all()).to.have.length(+n)
  })

  .Then(/^object (\S+) should be on channel (\S+) at beat (\d+)$/, function (value, channel, beat) {
    var object      = this.getObject(value)
    var objectBeat  = this.chart.measureToBeat(object.measure, object.fraction)
    expect(object.channel).to.equal(channel)
    expect(objectBeat).to.equal(+beat)
  })

  .Then(/^object (\S+) should be at beat ([\d\.]+)$/, function (value, beat) {
    var object      = this.getObject(value)
    var objectBeat  = this.chart.measureToBeat(object.measure, object.fraction)
    expect(objectBeat).to.equal(+beat)
  })

  .Then(/^object (\S+) should be at ([\d\.]+) seconds?$/, function (value, seconds) {
    var object        = this.getObject(value)
    var objectBeat    = this.chart.measureToBeat(object.measure, object.fraction)
    var objectSeconds = this.timing.beatToSeconds(objectBeat)
    expect(objectSeconds).to.be.closeTo(+seconds, 1e-3)
  })

)
