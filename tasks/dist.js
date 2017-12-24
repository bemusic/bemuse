
import gulp from 'gulp'
import merge from 'merge-stream'

import routes from '../config/routes'
import path from '../config/path'

gulp.task('dist', function () {
  let streams = routes.map(route => {
    return gulp.src(route.src + '/**/*')
      .pipe(gulp.dest(path('dist', ...route.dest)))
  })
  return merge(...streams)
})
