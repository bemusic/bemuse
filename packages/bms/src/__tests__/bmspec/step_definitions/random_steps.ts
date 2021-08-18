import steps from '../cucumber-dsl'

export default steps().Given(
  /^the random number generator yields (.*?)$/,
  function (string: string) {
    var result = string.split(', ').map(function (x) {
      return +x
    })
    this.parseOptions.rng = function () {
      return result.shift()!
    }
  },
)
