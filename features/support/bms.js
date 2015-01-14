
var bms = require('../..')

var Compiler = bms.Compiler
var Timing   = bms.Timing
var Notes    = bms.Notes

module.exports = function() {

  this.World.plug(function() {

    this.parseBMS = function(string) {
      this.source = string
      this.result = Compiler.compile(this.source)
      this.chart  = this.result.chart
    }

    this.prop('timing', function() {
      return Timing.fromBMSChart(this.chart)
    })

    this.prop('notes', function() {
      return Notes.fromBMSChart(this.chart)
    })

    this.getObject = function(value) {
      var matching = this.chart.objects.all().filter(function(object) {
        return object.value === value
      })
      expect(matching).to.have.length(1, 'getObject(' + value + ')')
      return matching[0]
    }

    this.getNote = function(value) {
      var matching = this.notes.all().filter(function(object) {
        return object.keysound === value
      })
      expect(matching).to.have.length(1, 'getNote(' + value + ')')
      return matching[0]
    }

  })

}
