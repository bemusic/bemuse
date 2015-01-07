
import fs      from 'fs'
import gulp    from 'gulp'
import gutil   from 'gulp-util'
import webpack from 'webpack'
import config  from '../config/webpack'
import path    from '../config/path'

gulp.task('build', ['dist'], function(callback) {
  webpack(config, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({ colors: true }))
    inlineBootScript()
    callback()
  })
})

// Inlines boot loading script directly into the HTML file
function inlineBootScript() {
  let contents = fs.readFileSync(path('dist', 'index.html'), 'utf-8')
  let boot = fs.readFileSync(path('dist', 'build', 'boot.js'), 'utf-8')
  let re = /(<!--\sBEGIN BOOT SCRIPT\s-->)[\s\S]*(<!--\sEND BOOT SCRIPT\s-->)/
  ;contents = contents.replace(re, (x, a, b) => `${a}${scriptTag(boot)}${b}`)
  fs.writeFileSync(path('dist', 'index.html'), contents, 'utf-8')
}

function scriptTag(text) {
  return `<script>${text}</script>`
}
