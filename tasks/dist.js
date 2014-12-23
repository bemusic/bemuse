
import gulp    from 'gulp'
import gutil   from 'gulp-util'
import webpack from 'webpack'
import merge   from 'merge-stream'

import config  from '../webpack.config'
import routes  from '../config/routes'
import path    from '../config/path'

gulp.task('dist', function() {
  let streams = routes.map(route => {
    return gulp.src(route.src + '/**/*')
      .pipe(gulp.dest(path('dist', ...route.dest)))
  })
  return merge(...streams)
})


