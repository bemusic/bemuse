import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import sinon from 'sinon/pkg/sinon'

export function prepareTestEnvironment () {
  mocha.setup('bdd')
  chai.use(chaiAsPromised)
  chai.use(sinonChai)
  global.expect = chai.expect
  global.sinon = sinon
}

export default prepareTestEnvironment
