
var steps = require('artstep')

module.exports = (steps()

  .Given(/^a BMS file as follows$/, function (string) {
    this.parseBMS(string)
  })

)
