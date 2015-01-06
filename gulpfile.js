
var gulp = require('gulp')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')

var files = {
  specs: ['spec/**/*_spec.js'],
  sources: ['spec/**/*_sources.js'],
}

function test() {
  global.expect = require('chai').expect
  return gulp.src(files.specs, { read: false })
    .pipe(mocha({reporter: 'nyan'}))
}

gulp.task('test', function() {
  return test()
})

gulp.task('test-cov', function(callback) {
  global.expect = require('chai').expect
  gulp.src(files.sources)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      test()
        .pipe(istanbul.writeReports())
        .on('end', callback)
    })
})
