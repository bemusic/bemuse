
var steps = require('artstep')

module.exports = (steps()

  .Given(/^the random number generator yields (.*?)$/, function (string) {
    var result = string.split(', ').map(function(x) { return +x })
    this.parseOptions.rng = function() {
      return result.shift()
    }
  })

)
