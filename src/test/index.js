
// This file boots up Jasmine
//
import '../polyfill'
import 'script!mocha/mocha.js'
import 'style!mocha/mocha.css'
import 'style!./support/mocha-overrides.css'
import 'expectations'

let mochaElement = document.createElement('div')
mochaElement.id = 'mocha'
document.body.appendChild(mochaElement)

mocha.setup('bdd')

import 'val!./load.js'

let specs = []

mocha.run()
.on('test end', function(test) {
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
.on('test end', function(test) {
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
.on('suite end', function(suite) {
  if (suite.root) {
    let coverage = window.__coverage__ || null
    let json = JSON.stringify({ specs, coverage })
    let xh = new XMLHttpRequest()
    xh.open('POST', '/api/test', true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(json)
  }
})

