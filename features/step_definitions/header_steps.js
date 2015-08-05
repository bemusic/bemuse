
var steps = require('artstep')

module.exports = (steps()

  .Then(/^the header "([^"]*)" should have value "([^"]*)"$/, function (name, value) {
    expect(this.chart.headers.get(name)).to.equal(value)
  })

)
