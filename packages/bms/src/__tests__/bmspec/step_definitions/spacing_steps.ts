import steps from '../cucumber-dsl'
import { expect } from 'chai'

export default steps().Then(
  /^note spacing at beat ([-\d.]+) is ([-\d.]+)$/,
  function (beat, value) {
    expect(this.spacing.factor(+beat)).to.equal(+value)
  },
)
