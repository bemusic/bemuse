import steps from '../cucumber-dsl'

export default steps().Given(/^a BMS file as follows$/, function (string) {
  this.parseBMS(string)
})
