
var bms = require('../..')

var Compiler = bms.Compiler
var Timing   = bms.Timing
var Notes    = bms.Notes
var SongInfo = bms.SongInfo

module.exports = function() {

  var World = this.World

  World.prototype.parseBMS = function(string) {
    this.source = string
    this.result = Compiler.compile(this.source)
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

}
