import steps from '../cucumber-dsl'

export default steps().Then(
  /^note spacing at beat ([-\d.]+) is ([-\d.]+)$/,
  function (beat, value) {
    expect(this.spacing.factor(+beat)).to.equal(+value)
  },
)
