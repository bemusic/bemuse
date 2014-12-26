
import gulp             from 'gulp'
import gutil            from 'gulp-util'
import webpack          from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import express          from 'express'
import notifier         from 'node-notifier'

import config           from '../config/webpack'
import routes           from '../config/routes'
import testMiddleware   from './support/test-middleware'

gulp.task('server', function(callback) {

  var compiler = webpack(config)
  var server = new WebpackDevServer(compiler, config.devServer)

  server.use('/api/test', testMiddleware(function(result) {
    let stat = { passed: 0, pending: 0, failed: 0 }
    for (let spec of result.specs) {
      if (spec.status === 'passed') {
        stat.passed += 1
      } else if (spec.status === 'pending') {
        stat.pending += 1
      } else {
        stat.failed += 1
      }
    }
    let notification
    let count = result.specs.length
    if (stat.failed > 0) {
      notification = {
        title: 'FAILED',
        message: `${stat.failed}/${count} failed`,
      }
    } else {
      notification = {
        title: 'PASSED',
        message: `${stat.passed}/${count} passed`,
      }
    }
    notifier.notify(notification)
  }))

  for (let route of routes) {
    console.log(route)
    server.use('/' + route.dest.join('/'), express.static(route.src))
  }

  server.listen(8080, '0.0.0.0', function(err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/')
  })

  void callback

})
