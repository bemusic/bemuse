
var Compiler = require('../../compiler')
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

  Then(/^object (\S+) should be on channel (\S+) at beat (\d+)$/, function (value, channel, beat, callback) {
    var chart = this._chart
    expect(chart.objects.all().some(function(object) {
      return object.value === value && object.channel === channel &&
             chart.measureToBeat(object.measure, object.fraction) === +beat
    })).to.be.ok()
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




