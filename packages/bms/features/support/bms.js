const bms = require('../../lib')

const Compiler = bms.Compiler
const Timing = bms.Timing
const Notes = bms.Notes
const SongInfo = bms.SongInfo
const Keysounds = bms.Keysounds
const Positioning = bms.Positioning
const Spacing = bms.Spacing

module.exports = function () {
  const World = this.World

  World.plug(function () {
    this.parseOptions = {}
  })

  World.prototype.parseBMS = function (string) {
    this.source = string
    this.result = Compiler.compile(this.source, this.parseOptions)
    this.chart = this.result.chart
  }

  World.prototype.getObject = function (value) {
    const matching = this.chart.objects.all().filter(function (object) {
      return object.value === value
    })
    expect(matching).to.have.length(1, 'getObject(' + value + ')')
    return matching[0]
  }

  World.prototype.getNote = function (value) {
    const matching = this.notes.all().filter(function (object) {
      return object.keysound === value
    })
    expect(matching).to.have.length(1, 'getNote(' + value + ')')
    return matching[0]
  }

  World.prop('timing', function () {
    return Timing.fromBMSChart(this.chart)
  })

  World.prop('notes', function () {
    return Notes.fromBMSChart(this.chart)
  })

  World.prop('songInfo', function () {
    return SongInfo.fromBMSChart(this.chart)
  })

  World.prop('keysounds', function () {
    return Keysounds.fromBMSChart(this.chart)
  })

  World.prop('positioning', function () {
    return Positioning.fromBMSChart(this.chart)
  })

  World.prop('spacing', function () {
    return Spacing.fromBMSChart(this.chart)
  })
}
