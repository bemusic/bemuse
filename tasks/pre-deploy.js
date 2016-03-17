

import gulp     from 'gulp'
import fs       from 'fs'
import path     from '../config/path'
import co       from 'co'

const readFile = Promise.promisify(fs.readFile, fs)

gulp.task('pre-deploy', co.wrap(function * () {
  let data = yield readFile(path('dist', 'index.html'), 'utf-8')
  check('New Relic inlined',        () => /NREUM/.test(data))
  check('Boot script inlined',      () => /webpackJsonp/.test(data))
  check('Google Analytics inlined', () => /GoogleAnalyticsObject/.test(data))
}))

function check (title, condition) {
  if (condition()) {
    console.log('[OK!!]', title)
  } else {
    console.log('[FAIL]', title)
    throw new Error('Pre-deploy check error: ' + title)
  }
}

