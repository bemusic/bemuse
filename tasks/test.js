
import gulp    from 'gulp'
import { run } from './support/test-runner'

gulp.task('test', function() {
  return run()
})

