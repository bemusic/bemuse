import gulp from 'gulp'

import * as server from './support/dev-server'

gulp.task('server', function (_callback) {
  void _callback
  server.start()
})
