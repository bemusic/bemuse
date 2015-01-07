
var gulp = require('gulp')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')

var files = {
  specs: ['spec/**/*_spec.js'],
  sources: ['spec/**/*_sources.js'],
}

function mochaTest() {
  global.expect = require('chai').expect
  return gulp.src(files.specs, { read: false })
    .pipe(mocha({reporter: 'nyan'}))
}

gulp.task('test', ['test:mocha:cov'])

gulp.task('test:mocha', function() {
  return mochaTest()
})

gulp.task('test:mocha:cov', function(callback) {
  global.expect = require('chai').expect
  gulp.src(files.sources)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      mochaTest()
        .pipe(istanbul.writeReports())
        .on('end', callback)
    })
})
