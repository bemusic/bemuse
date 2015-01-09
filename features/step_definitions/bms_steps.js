
var Compiler = require('../../compiler')
var Timing = require('../../timing')
var expect = require('chai').expect
var Promise = require('bluebird')

var PENDING = {}

module.exports = function() {

  var Given = sugar(this, this.Given)
  var When  = sugar(this, this.When)
  var Then  = sugar(this, this.Then)

  Given(/^a BMS file as follows$/, function (string) {
    this._text = string
    this._compileResult = Compiler.compile(this._text)
    this._chart = this._compileResult.chart
    this._timing = Timing.fromBMSChart(this._chart)
    this._getObject = function(value) {
      var matching = this._chart.objects.all().filter(function(object) {
        return object.value === value
      })
      expect(matching.length).to.equal(1, 'getObject(' + value + ')')
      return matching[0]
    }
  })

  Then(/^there should be (\d+) header sentences?$/, function (n) {
    expect(this._compileResult.headerSentences).to.equal(+n)
  })

  Then(/^there should be (\d+) channel sentences?$/, function (n) {
    expect(this._compileResult.channelSentences).to.equal(+n)
  })

  Then(/^the header "([^"]*)" should have value "([^"]*)"$/, function (name, value) {
    expect(this._chart.headers.get(name)).to.equal(value)
  })

  Then(/^there should be (\d+) objects$/, function (n) {
    expect(this._chart.objects.all().length).to.equal(+n)
  })

  Then(/^object (\S+) should be on channel (\S+) at beat (\d+)$/, function (value, channel, beat) {
    var object      = this._getObject(value)
    var objectBeat  = this._chart.measureToBeat(object.measure, object.fraction)
    expect(object.channel).to.equal(channel)
    expect(objectBeat).to.equal(+beat)
  })

  Then(/^object (\S+) should be at beat ([\d\.]+)$/, function (value, beat) {
    var object      = this._getObject(value)
    var objectBeat  = this._chart.measureToBeat(object.measure, object.fraction)
    expect(objectBeat).to.equal(+beat)
  })

  Then(/^object (\S+) should be at ([\d\.]+) seconds?$/, function (value, seconds) {
    var object        = this._getObject(value)
    var objectBeat    = this._chart.measureToBeat(object.measure, object.fraction)
    var objectSeconds = this._timing.beatToSeconds(objectBeat)
    expect(objectSeconds).to.equal(+seconds)
  })

}

function sugar(world, defineFunction) {
  return function(pattern, f) {
    defineFunction.call(world, pattern, function() {
      var callback = arguments[arguments.length - 1]
      Promise.try(f, [].slice.call(arguments), world).then(
        function(result) {
          if (result == PENDING) {
            callback.pending()
          } else {
            callback()
          }
        },
        function(err) {
          callback(err)
        }
      )
    })
  }
}




