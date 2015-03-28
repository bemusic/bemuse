
var def = require('./def')

module.exports = def(function(World, Given, When, Then) {

  void When
  void Then

  Given(/^the random number generator yields (.*?)$/, function (string) {
    var result = string.split(', ').map(function(x) { return +x })
    this.parseOptions.rng = function() {
      return result.shift()
    }
  })

})

