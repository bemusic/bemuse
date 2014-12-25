
import gulp    from 'gulp'
import gutil   from 'gulp-util'
import webpack from 'webpack'
import config  from '../config/webpack'

gulp.task('build', ['dist'], function(callback) {
  webpack(config, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({ colors: true }))
    callback()
  })
})

