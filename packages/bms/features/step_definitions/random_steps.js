const steps = require('artstep')

module.exports = steps().Given(
  /^the random number generator yields (.*?)$/,
  function (string) {
    const result = string.split(', ').map(function (x) {
      return +x
    })
    this.parseOptions.rng = function () {
      return result.shift()
    }
  }
)
