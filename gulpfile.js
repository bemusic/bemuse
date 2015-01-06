
var gulp = require('gulp')
var mocha = require('gulp-mocha')

gulp.task('test', function() {
  global.expect = require('chai').expect
  return gulp.src('spec/**/*_spec.js', { read: false })
    .pipe(mocha({reporter: 'nyan'}))
})

