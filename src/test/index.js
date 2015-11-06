
// This file boots up Jasmine
//
import 'script!mocha/mocha.js'
import 'style!mocha/mocha.css'
import 'style!./support/mocha-overrides.css'

import chai           from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai      from 'sinon-chai'
import sinon          from 'sinon'

export function main () {
  setupMocha()
  loadSpecs()
  runMocha()
}

function setupMocha () {
  let mochaElement = document.createElement('div')
  mochaElement.id = 'mocha'
  document.body.appendChild(mochaElement)
  mocha.setup('bdd')
  chai.use(chaiAsPromised)
  chai.use(sinonChai)
  global.expect = chai.expect
  global.sinon  = sinon
}

function loadSpecs () {
  let context = require.context('../../spec', true, /_spec\.js$/)
  for (let key of context.keys()) {
    context(key)
  }
}

function runMocha () {
  let specs = []
  mocha.run()
  .on('test end', function reportFailedSpec (test) {
    if (test.err) {
      console.log('%cFailed Spec: %c%s\n %c%s',
        'color: black; font: 16px sans-serif',
        'color: black; font: bold 16px sans-serif',
        test.title,
        'color: red; font: bold 1em sans-serif',
        test.err.message)
      console.error(test.err.stack)
    }
  })
  .on('test end', function (test) {
    if ('passed' === test.state) {
      specs.push({
        fullName: test.title,
        status: 'passed',
      })
    } else if (test.pending) {
      specs.push({
        fullName: test.title,
        status: 'pending',
      })
    } else {
      specs.push({
        fullName: test.title,
        status: 'failed',
        failedExpectations: [
          { message: test.err.message, stack: test.err.stack }
        ],
      })
    }
  })
  .on('suite end', function (suite) {
    if (suite.root) {
      let coverage = window.__coverage__ || null
      let json = JSON.stringify({ specs, coverage })
      let xh = new XMLHttpRequest()
      xh.open('POST', '/api/test', true)
      xh.setRequestHeader('Content-Type', 'application/json')
      xh.send(json)
    }
  })
}
