
var def = require('./def')

module.exports = def(function(World, Given, When, Then) {

  Then(/^song title should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.title).to.equal(text)
  })

  Then(/^song artist should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.artist).to.equal(text)
  })

  Then(/^song genre should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.genre).to.equal(text)
  })

})

