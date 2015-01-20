
import gulp    from 'gulp'
import { run } from './support/test-runner'

gulp.task('test', function() {
  return run()
})

gulp.task('test:exit', function() {
  return run().then(
    ()  => { process.exit(0) },
    (e) => { setTimeout(() => process.exit(1)); throw e }
  )
})
