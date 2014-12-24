
import gulp       from 'gulp'
import express    from 'express'
import http       from 'http'
import launcher   from 'browser-launcher'
import co         from 'co'
import promisify  from 'es6-promisify'
import gutil      from 'gulp-util'
import fs         from 'fs'

import path             from '../config/path'
import testMiddleware   from './support/test-middleware'

gulp.task('test', test)

export function test() {

  return co(function*() {

    let log = gutil.log.bind(gutil, '[test]')

    let promises = {
      server: startTestServer(),
      launch: startBrowserLauncher(),
    }

    let launch = yield promises.launch
    log('browser launcher initiated')

    let server = yield promises.server
    log('server initialized')

    let url = 'http://localhost:' + server.address().port + '/?mode=test'
    let options = {
      browser: process.env.BROWSER || 'chrome',
      headless: process.env.HEADLESS === 'true',
    }
    let browser = yield promisify(launch)(url, options)
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
        log('coverage report written')
      }

      if (fail) throw new gutil.PluginError('test', 'Testing failed!')

    } finally {
      browser.kill()
    }

  })

}

function startTestServer() {

  return new Promise(function(resolve, reject) {

    let app = express()
    let server = http.createServer(app)

    server.testResult = new Promise(function(resolve) {
      app.use('/api/test', testMiddleware(function(result) {
        resolve(result)
      }))
    })

    app.use(express.static(path('dist')))

    server.listen(0, function(err) {
      if (err) return reject(err)
      resolve(server)
    })

  })

}

function startBrowserLauncher() {
  return promisify(launcher)()
}

