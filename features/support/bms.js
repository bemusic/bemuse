
var bms = require('../..')

var Compiler    = bms.Compiler
var Timing      = bms.Timing
var Notes       = bms.Notes
var SongInfo    = bms.SongInfo
var Keysounds   = bms.Keysounds
var Positioning = bms.Positioning
var Spacing     = bms.Spacing

module.exports = function() {

  var World = this.World

  World.plug(function() {
    this.parseOptions = { }
  })

  World.prototype.parseBMS = function(string) {
    this.source = string
    this.result = Compiler.compile(this.source, this.parseOptions)
    this.chart  = this.result.chart
  }

  World.prototype.getObject = function(value) {
    var matching = this.chart.objects.all().filter(function(object) {
      return object.value === value
    })
    expect(matching).to.have.length(1, 'getObject(' + value + ')')
    return matching[0]
  }

  World.prototype.getNote = function(value) {
    var matching = this.notes.all().filter(function(object) {
      return object.keysound === value
    })
    expect(matching).to.have.length(1, 'getNote(' + value + ')')
    return matching[0]
  }

  World.prop('timing', function() {
    return Timing.fromBMSChart(this.chart)
  })

  World.prop('notes', function() {
    return Notes.fromBMSChart(this.chart)
  })

  World.prop('songInfo', function() {
    return SongInfo.fromBMSChart(this.chart)
  })

  World.prop('keysounds', function() {
    return Keysounds.fromBMSChart(this.chart)
  })

  World.prop('positioning', function() {
    return Positioning.fromBMSChart(this.chart)
  })

  World.prop('spacing', function() {
    return Spacing.fromBMSChart(this.chart)
  })

}
