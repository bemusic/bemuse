
import gulp       from 'gulp'
import { join }   from 'path'
import { Server } from 'karma'

gulp.task('test', function (done) {
  new Server({ configFile: join(__dirname, '..', 'karma.conf.js'), singleRun: true }, done).start()
})
