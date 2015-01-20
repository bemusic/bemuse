
import gulp    from 'gulp'
import { run } from './support/test-runner'

gulp.task('test', function() {
  return run()
})

gulp.task('test:exit', function() {
  return run().then(
    function() { process.exit(0) },
    function() { process.exit(1) }
  )
})
