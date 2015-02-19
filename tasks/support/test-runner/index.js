
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
        result = yield server.testResult.timeout(20000)
      } finally {
        log('result collected')
        server.close()
        server.unref()
      }

      for (let spec of result.specs) {
        if (spec.status === 'passed') {
          console.log('\x1b[1;32m[OK]\x1b[m', spec.fullName)
        } else if (spec.status === 'pending') {
          console.log('\x1b[1;33m[PEND]\x1b[m', spec.fullName)
        } else {
          fail = true
          console.log('\x1b[1;31m[FAIL]\x1b[m', spec.fullName)
          for (let expectation of spec.failedExpectations) {
            console.log('\x1b[1;31m' + expectation.message + '\x1b[m')
            console.log(expectation.stack)
          }
        }
      }

      if (result.coverage) {
        yield CoverageReport.generate(result.coverage)
      }

      if (fail) throw new gutil.PluginError('test', 'Testing failed!')

    } finally {
      browser.kill()
    }

  })

}

