
import gulp       from 'gulp'
import { join }   from 'path'
import { Server } from 'karma'

gulp.task('test', function (done) {
  new Server({ configFile: join(__dirname, '..', 'karma.conf.js'), singleRun: true }, err => {
    if (err) return done(err)
    done()
    setTimeout(() => process.exit(0), 500)
  }).start()
})
