
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

  Then(/^there should be (\d+) header sentences$/, function (n) {
    expect(this._compileResult.headerSentences).to.equal(+n)
  })

  Then(/^there should be (\d+) channel sentence$/, function (n) {
    expect(this._compileResult.channelSentences).to.equal(+n)
  })

  Then(/^the header "([^"]*)" should have value "([^"]*)"$/, function (name, value) {
    expect(this._chart.headers.get(name)).to.equal(value)
  })

  Then(/^there should be (\d+) objects$/, function (arg1) {
    return PENDING
  })

  Then(/^there should be (\d+) object at beat (\d+)$/, function (arg1, arg2) {
    return PENDING
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




