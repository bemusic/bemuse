
import gulp             from 'gulp'
import gutil            from 'gulp-util'
import webpack          from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import express          from 'express'
import config           from '../webpack.config'
import routes           from '../config/routes'

gulp.task('server', function(callback) {
  var compiler = webpack(config)
  var server = new WebpackDevServer(compiler, config.devServer)
  for (let route of routes) {
    console.log(route)
    server.use('/' + route.dest.join('/'), express.static(route.src))
  }
  server.listen(8080, 'localhost', function(err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/')
  })
})
