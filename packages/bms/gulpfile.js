const gulp = require('gulp')
const mocha = require('gulp-mocha')
const cucumber = require('gulp-cucumber')
const fs = require('fs')
const childProcess = require('child_process')

const files = {
  specs: ['spec/**/*_spec.js'],
  sources: [
    '*.js',
    'bms/*.js',
    'compiler/*.js',
    'keysounds/*.js',
    'notes/*.js',
    'reader/*.js',
    'song-info/*.js',
    'speedcore/*.js',
    'time-signatures/*.js',
    'timing/*.js',
    'util/*.js',
  ],
  get features() {
    const home = process.env.BMSPEC_HOME || './bmspec'
    if (home === undefined) {
      console.error(
        'WARNING! BMSPEC_HOME is not set. BMSpec test suites will not be run!'
      )
      return []
    }
    return require('./features').map(function (file) {
      const filePath = home + '/features/' + file
      if (!fs.existsSync(filePath)) {
        console.error('WARNING! ' + filePath + ' does not exist.')
      }
      return filePath
    })
  },
}

gulp.task('test:cucumber', cucumberTest)
gulp.task('test:mocha', mochaTest)
gulp.task('test', gulp.series('test:mocha', 'test:cucumber'))

gulp.task('bmspec:update', async function () {
  if (!fs.existsSync('bmspec')) {
    console.log('* Cloning bmspec...')
    childProcess.execSync(
      `git clone https://github.com/bemusic/bms-spec.git bmspec`,
      {
        stdio: 'inherit',
      }
    )
  } else {
    console.log('* Updating bmspec...')
    childProcess.execSync(`git pull`, {
      stdio: 'inherit',
      cwd: 'bmspec',
    })
  }
})

function mochaTest() {
  global.expect = require('chai').expect
  return gulp
    .src(files.specs, { read: false })
    .pipe(mocha({ reporter: 'nyan' }))
}

function cucumberTest() {
  return gulp.src(files.features, { read: false }).pipe(
    cucumber({
      steps: 'features/step_definitions/**/*_steps.js',
      support: ['features/support/world.js', 'features/support/*.js'],
    })
  )
}
