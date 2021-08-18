import steps from '../cucumber-dsl'
import { expect } from 'chai'

export default steps().Then(
  /^the header "([^"]*)" should have value "([^"]*)"$/,
  function (name, value) {
    expect(this.chart.headers.get(name)).to.equal(value)
  },
)
