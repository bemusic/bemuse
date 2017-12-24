import 'bemuse/bootstrap'

import prepareTestEnvironment from './prepareTestEnvironment'

const TestBedMocha = require('test-bed/adapters/mocha')
TestBedMocha.setup()

prepareTestEnvironment()

TestBedMocha.run({
  context: require.context('..', true, /\.spec\.js$/)
})
