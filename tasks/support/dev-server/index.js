
import gutil            from 'gulp-util'
import webpack          from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import express          from 'express'
import notifier         from 'node-notifier'

import config           from '../../../config/webpack'
import routes           from '../../../config/routes'
import path             from '../../../config/path'

import * as CoverageReport  from '../coverage-report'

import testMiddleware       from '../test-middleware'
import testStat             from '../test-middleware/stat'

export function start() {

  var compiler = webpack(config)
  var server = new WebpackDevServer(compiler, config.devServer)

  server.use('/api/test', testMiddleware(function(result) {
    let { total, failed, passed, _pending } = testStat(result.specs)
    void _pending

    let notification
    if (failed > 0) {
      notification = {
        title: 'FAILED',
        message: `${failed}/${total} failed`,
      }
    } else {
      notification = {
        title: 'PASSED',
        message: `${passed}/${total} passed`,
      }
    }
    notifier.notify(notification)

    if (result.coverage) {
      CoverageReport.generate(result.coverage)
    }
  }))

  for (let route of routes) {
    server.use('/' + route.dest.join('/'), express.static(route.src))
  }

  server.use('/music', express.static(path('..', 'music')))
  server.use('/coverage', express.static(path('coverage', 'lcov-report')))

  server.listen(8080, '0.0.0.0', function(err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/')
  })

}

