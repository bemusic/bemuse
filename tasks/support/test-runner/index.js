
import co         from 'co'
import promisify  from 'es6-promisify'
import gutil      from 'gulp-util'
import fs         from 'fs'
import { exec }   from 'child_process'

import path                 from '../../../config/path'
import * as TestServer      from './server'
import * as BrowserLauncher from './browser'

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
        result = yield server.testResult
      } finally {
        log('result collected')
        server.close()
        server.unref()
      }

      for (let spec of result.specs) {
        let passed = spec.passedExpectations.length
        let failed = spec.failedExpectations.length
        let total = passed + failed
        let stats = `[${passed}/${total}]`
        if (spec.status === 'passed') {
          console.log('\033[1;32m[OK]\033[m', spec.fullName, stats)
        } else if (spec.status === 'pending') {
          console.log('\033[1;33m[PEND]\033[m', spec.fullName, stats)
        } else {
          fail = true
          console.log('\033[1;31m[FAIL]\033[m', spec.fullName, stats)
          for (let expectation of spec.failedExpectations) {
            console.log('\033[1;31m' + expectation.message + '\033[m')
            console.log(expectation.stack)
          }
        }
      }

      if (result.coverage) {
        if (!fs.existsSync(path('coverage'))) {
          fs.mkdirSync(path('coverage'))
        }
        fs.writeFileSync(
          path('coverage', 'coverage.json'),
          JSON.stringify(result.coverage),
          'utf8'
        )
        log('coverage data written')

        yield generateIstanbulReport()
        log('lcov report written')
      }

      if (fail) throw new gutil.PluginError('test', 'Testing failed!')

    } finally {
      browser.kill()
    }

  })

}

function generateIstanbulReport() {
  return promisify(exec)('istanbul report')
}
