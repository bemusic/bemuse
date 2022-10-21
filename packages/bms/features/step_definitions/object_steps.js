const steps = require('artstep')

module.exports = steps()
  .Then(/^there should be (\d+) objects$/, function (n) {
    expect(this.chart.objects.all()).to.have.length(+n)
  })

  .Then(
    /^object (\S+) should be on channel (\S+) at beat (\d+)$/,
    function (value, channel, beat) {
      const object = this.getObject(value)
      const objectBeat = this.chart.measureToBeat(object.measure, object.fraction)
      expect(object.channel).to.equal(channel)
      expect(objectBeat).to.equal(+beat)
    }
  )

  .Then(/^object (\S+) should be at beat ([\d.]+)$/, function (value, beat) {
    const object = this.getObject(value)
    const objectBeat = this.chart.measureToBeat(object.measure, object.fraction)
    expect(objectBeat).to.equal(+beat)
  })

  .Then(
    /^object (\S+) should be at ([\d.]+) seconds?$/,
    function (value, seconds) {
      const object = this.getObject(value)
      const objectBeat = this.chart.measureToBeat(object.measure, object.fraction)
      const objectSeconds = this.timing.beatToSeconds(objectBeat)
      expect(objectSeconds).to.be.closeTo(+seconds, 1e-3)
    }
  )
