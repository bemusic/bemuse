
import co         from 'co'
import gutil      from 'gulp-util'
import fs         from 'fs'
import { exec }   from 'child_process'
import path       from '../../../config/path'

let log = gutil.log.bind(gutil, '[coverage-report]')

export function generate (coverage) {
  return co(function*() {
    if (!fs.existsSync(path('coverage'))) {
      fs.mkdirSync(path('coverage'))
    }
    fs.writeFileSync(
      path('coverage', 'coverage.json'),
      JSON.stringify(coverage),
      'utf8'
    )
    log('coverage data written')

    yield generateIstanbulReport()
    log('lcov report written')
  })
}

function generateIstanbulReport () {
  return Promise.promisify(exec)('istanbul report')
}
