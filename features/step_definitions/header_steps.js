
var def = require('./def')

module.exports = def(function(World, Given, When, Then) {

  Then(/^the header "([^"]*)" should have value "([^"]*)"$/, function (name, value) {
    expect(this.chart.headers.get(name)).to.equal(value)
  })

})

