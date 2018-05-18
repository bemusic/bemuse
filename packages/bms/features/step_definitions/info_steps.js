
var steps = require('artstep')

module.exports = (steps()

  .Then(/^song title should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.title).to.equal(text)
  })

  .Then(/^song artist should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.artist).to.equal(text)
  })

  .Then(/^song genre should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.genre).to.equal(text)
  })

  .Then(/^song should have difficulty (\d+)$/, function (value) {
    expect(this.songInfo.difficulty).to.equal(+value)
  })

  .Then(/^song should have play level (\d+)$/, function (value) {
    expect(this.songInfo.level).to.equal(+value)
  })

  .Then(/^song subtitle should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.subtitles[0]).to.equal(text)
  })

  .Then(/^song subtitle should be:$/, function (text) {
    expect(this.songInfo.subtitles.join('\n')).to.equal(text)
  })

  .Then(/^song subartist should be "([^"]*)"$/, function (text) {
    expect(this.songInfo.subartist[0]).to.equal(text)
  })

  .Then(/^song subartist should be:$/, function (text) {
    expect(this.songInfo.subartists.join('\n')).to.equal(text)
  })

)
