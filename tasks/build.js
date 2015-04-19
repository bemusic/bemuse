
import co       from 'co'
import fs       from 'fs'
import gulp     from 'gulp'
import gutil    from 'gulp-util'
import webpack  from 'webpack'
import config   from '../config/webpack'
import path     from '../config/path'
import * as Env from '../config/env'

const readFile  = Promise.promisify(fs.readFile, fs)
const writeFile = Promise.promisify(fs.writeFile, fs)

gulp.task('build', ['dist'], co.wrap(function*() {
  let stats = yield Promise.promisify(webpack)(config)
  gutil.log('[webpack]', stats.toString({ colors: true }))
  if (Env.production()) yield postProcess()
}))

function postProcess() {
  return readFile(path('dist', 'index.html'), 'utf-8')
    .then(inlineBootScript)
    .then(ssi)
    .then(result => writeFile(path('dist', 'index.html'), result, 'utf-8'))
}

function inlineBootScript(html) {
  const re = /(<!--\sBEGIN BOOT SCRIPT\s-->)[\s\S]*(<!--\sEND BOOT SCRIPT\s-->)/
  let boot = fs.readFileSync(path('dist', 'build', 'boot.js'), 'utf-8')
  return html.replace(re, (x, a, b) => `${a}${scriptTag(boot)}${b}`)
}

function ssi(html) {
  const re = /<!--\s*#include file="([^"]+)"\s*-->/g
  return html.replace(re, (x, file) => fs.readFileSync(path('dist', file)))
}

function scriptTag(text) {
  return `<script>${text}</script>`
}
