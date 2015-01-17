
var def = require('./def')

module.exports = def(function(World, Given, When, Then) {

  void When
  void Then

  Given(/^a BMS file as follows$/, function (string) {
    this.parseBMS(string)
  })

})

