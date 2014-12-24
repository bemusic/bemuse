
import gulp     from 'gulp'
import { test } from './test'

gulp.task('travis', function() {

  process.env.BROWSER = 'firefox'

  return test()
  .then(
    () => {
      setTimeout(() => process.exit(), 1000)
    },
    e => {
      setTimeout(() => process.exit(1), 1000)
      throw e
    }
  )

})
