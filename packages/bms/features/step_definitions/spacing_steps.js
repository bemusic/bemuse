
var steps = require('artstep')

module.exports = (steps()

  .Then(/^note spacing at beat ([\-\d\.]+) is ([\-\d\.]+)$/, function (beat, value) {
    expect(this.spacing.factor(+beat)).to.equal(+value)
  })

)
