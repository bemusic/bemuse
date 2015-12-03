
import gulp       from 'gulp'
import { Server } from 'karma'

gulp.task('test', function (done) {
  new Server({ configFile: __dirname + '/../karma.conf.js', singleRun: true }, done).start()
})
