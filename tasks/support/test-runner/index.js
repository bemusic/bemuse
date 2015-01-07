
import co         from 'co'
import gutil      from 'gulp-util'

import * as TestServer      from './server'
import * as BrowserLauncher from './browser'
import * as CoverageReport  from '../coverage-report'

let log = gutil.log.bind(gutil, '[test-runner]')

export function run() {

  return co(function*() {

    let promises = {
      server: TestServer.start(),
      launcher: BrowserLauncher.start(),
    }

    let launcher = yield promises.launcher
    log('browser launcher initiated')

    let server = yield promises.server
    log('server initialized')

    let url = 'http://localhost:' + server.address().port + '/?mode=test'
    let browser = yield launcher.launch(url)
    log('browser launched to ' + url)

    try {

      let result
      let fail = false

      try {
        result = yield server.testResult.timeout(10000)
      } finally {
        log('result collected')
        server.close()
        server.unref()
      }

      for (let spec of result.specs) {
        if (spec.status === 'passed') {
          console.log('\033[1;32m[OK]\033[m', spec.fullName)
        } else if (spec.status === 'pending') {
          console.log('\033[1;33m[PEND]\033[m', spec.fullName)
        } else {
          fail = true
          console.log('\033[1;31m[FAIL]\033[m', spec.fullName)
          for (let expectation of spec.failedExpectations) {
            console.log('\033[1;31m' + expectation.message + '\033[m')
            console.log(expectation.stack)
          }
        }
      }

      if (result.coverage) {
        CoverageReport.generate(result.coverage)
      }

      if (fail) throw new gutil.PluginError('test', 'Testing failed!')

    } finally {
      browser.kill()
    }

  })

}

