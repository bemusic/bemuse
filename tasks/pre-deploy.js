import gulp from 'gulp'
import fs from 'fs'
import path from '../config/path'
import co from 'co'
import Promise from 'bluebird'

const readFile = Promise.promisify(fs.readFile, fs)

gulp.task(
  'pre-deploy',
  // TODO [$5d94c82086dc190007494e8c]: Convert the `co.wrap()` call in tasks/pre-deploy.js to async function
  // See issue #575 for more details.
  co.wrap(function*() {
    let data = yield readFile(path('dist', 'index.html'), 'utf-8')
    check('New Relic inlined', () => /NREUM/.test(data))
    check('Boot script inlined', () => /webpackJsonp/.test(data))
    check('Google Analytics inlined', () => /GoogleAnalyticsObject/.test(data))
  })
)

function check(title, condition) {
  if (condition()) {
    console.log('[OK!!]', title)
  } else {
    console.log('[FAIL]', title)
    throw new Error('Pre-deploy check error: ' + title)
  }
}
