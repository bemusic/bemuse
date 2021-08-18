import steps from '../cucumber-dsl'

export default steps()
  .Then(/^sound (\S+) references file "(.*?)"$/, function (id, file) {
    expect(this.keysounds.get(id)).to.equal(file)
  })

  .Then(/^sound (\S+) is a null reference$/, function (id) {
    void expect(this.keysounds.get(id)).to.be.undefined
  })
