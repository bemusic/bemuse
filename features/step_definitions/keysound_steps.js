
var def = require('./def')

module.exports = def(function(World, Given, When, Then) {

  Then(/^sound (\S+) references file "(.*?)"$/, function (id, file) {
    expect(this.keysounds.get(id)).to.equal(file)
  })

  Then(/^sound (\S+) is a null reference$/, function (id) {
    expect(this.keysounds.get(id)).to.be.undefined()
  })

})

