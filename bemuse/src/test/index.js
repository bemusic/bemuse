// This file boots up Mocha in the browser (the `?mode=test` entry point).
//
// Under webpack this used `script-loader!mocha/mocha.js` (to execute Mocha's
// browser bundle in the global scope) and `style-loader!` for the CSS. Under
// Vite we import the bundle as a raw string and evaluate it in the global
// scope — the closest equivalent of `script-loader` — which exposes the
// global `mocha`/`Mocha`. The CSS is imported normally (Vite injects it).
import mochaSource from 'mocha/mocha.js?raw'
import 'mocha/mocha.css'
import './support/mocha-overrides.css'

import loadSpecs from './loadSpecs'
import prepareTestEnvironment from './prepareTestEnvironment'

// Indirect eval runs in the global scope, so Mocha attaches to `window`.
;(0, eval)(mochaSource) // eslint-disable-line no-eval

export async function main() {
  setupMocha()
  prepareTestEnvironment()
  await loadSpecs()
  runMocha()
}

function setupMocha() {
  const mochaElement = document.createElement('div')
  mochaElement.id = 'mocha'
  document.body.appendChild(mochaElement)
}

function runMocha() {
  const specs = []
  mocha
    .run()
    .on('test end', function reportFailedSpec(test) {
      if (test.err) {
        console.log(
          '%cFailed Spec: %c%s\n %c%s',
          'color: black; font: 16px sans-serif',
          'color: black; font: bold 16px sans-serif',
          test.title,
          'color: red; font: bold 1em sans-serif',
          test.err.message
        )
        console.error(test.err.stack)
      }
    })
    .on('test end', function (test) {
      if (test.state === 'passed') {
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
            { message: test.err.message, stack: test.err.stack },
          ],
        })
      }
    })
    .on('suite end', function (suite) {
      if (suite.root) {
        const passed = specs.filter((s) => s.status === 'passed').length
        const failed = specs.filter((s) => s.status === 'failed').length
        const pending = specs.filter((s) => s.status === 'pending').length
        // Expose a machine-readable summary for headless test drivers.
        window.MOCHA_RESULTS = {
          total: specs.length,
          passed,
          failed,
          pending,
          failures: specs.filter((s) => s.status === 'failed'),
        }
        if (failed > 0) {
          document.documentElement.classList.add('mocha-is-failing')
        } else {
          document.documentElement.classList.add('mocha-is-passing')
        }
      }
    })
}
