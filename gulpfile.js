
var gulp = require('gulp')
var mocha = require('gulp-mocha')
var cucumber = require('gulp-cucumber')
var istanbul = require('gulp-istanbul')
var chain = require('stack-chain')

require('hide-stack-frames-from')('cucumber', 'bluebird')

var files = {
  specs: ['spec/**/*_spec.js'],
  sources: ['*.js', 'bms/*.js'],
  features: require('./features').map(function(file) {
              return 'features/bms-spec/' + file
            }),
}

gulp.task('test', function(callback) {
  return cover(mochaThenCucumberTest, callback)
})

gulp.task('test:cov', function(callback) {
  process.env.ENABLE_COVERAGE = 'true'
  return cover(mochaThenCucumberTest, callback)
})

gulp.task('test:cucumber', function(callback) {
  return cover(cucumberTest, callback)
})

gulp.task('test:mocha', function(callback) {
  return cover(mochaTest, callback)
})

function cover(fn, callback) {
  if (process.env.COV === 'true' || process.env.ENABLE_COVERAGE === 'true') {
    gulp.src(files.sources)
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('finish', function() {
        console.log('TESTING BEGIN')
        fn(function(error) {
          console.log('TESTING DONE')
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
  gulp.src(files.specs, { read: false })
    .pipe(mocha({reporter: 'nyan'}))
    .on('end', callback)
    .on('error', callback)
}

function cucumberTest(callback) {
  gulp.src(files.features, { read: false })
    .pipe(cucumber({
      steps: 'features/step_definitions/**/*_steps.js',
    }))
    .on('end', callback)
    .on('error', callback)
}

function mochaThenCucumberTest(callback) {
  mochaTest(function(error) {
    if (error) return callback(error)
    cucumberTest(callback)
  })
}

