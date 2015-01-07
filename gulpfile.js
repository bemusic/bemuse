
var gulp = require('gulp')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')

var files = {
  specs: ['spec/**/*_spec.js'],
  sources: ['spec/**/*_sources.js'],
}

function cover(fn, callback) {
  if (process.env.COV === 'true') {
    gulp.src(files.sources)
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('finish', function() {
        fn(function(error) {
          if (error) return callback(error)
          istanbul.writeReports()
            .once('end', callback)
            .once('error', callback)
            .emit('end')
        })
      })
  } else {
    fn(callback)
  }
}

function mochaTest(callback) {
  global.expect = require('chai').expect
  return gulp.src(files.specs, { read: false })
    .pipe(mocha({reporter: 'nyan'}))
    .on('end', callback)
    .on('error', callback)
}

gulp.task('test', ['test:mocha', 'test:cucumber'])

gulp.task('test:cucumber', function() {
  console.log('TODO: Cucumber Test')
})

gulp.task('test:mocha', function(callback) {
  return cover(mochaTest, callback)
})

