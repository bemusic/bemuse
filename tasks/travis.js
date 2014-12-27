
import gulp    from 'gulp'
import { run } from './support/test-runner'

gulp.task('travis', function() {
  process.env.BROWSER = 'firefox'
  return run().then(
    () => {
      setTimeout(() => process.exit(), 1000)
    },
    e => {
      setTimeout(() => process.exit(1), 1000)
      throw e
    }
  )
})
