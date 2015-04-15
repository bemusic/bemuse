
import gulp     from 'gulp'
import cucumber from 'gulp-cucumber'
import { run }  from './support/test-runner'
import path     from '../config/path'

gulp.task('test', function() {
  return run()
})

gulp.task('test:features', function() {
  require('hide-stack-frames-from')('cucumber')
  return gulp.src(path('features', '**', '*.feature'), { read: false })
    .pipe(cucumber({ steps: path('features', 'steps.js') }))
})

gulp.task('test:exit', function() {
  return run().then(
    ()  => { process.exit(0) },
    (e) => { setTimeout(() => process.exit(1)); throw e }
  )
})
