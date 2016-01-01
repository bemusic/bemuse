
import gutil            from 'gulp-util'
import webpack          from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import express          from 'express'

import config           from '../../../config/webpack'
import routes           from '../../../config/routes'
import path             from '../../../config/path'
import * as Env         from '../../../config/env'

export function start () {

  let port = Env.serverPort()
  var compiler = webpack(config)
  var server = new WebpackDevServer(compiler, config.devServer)

  for (let route of routes) {
    server.use('/' + route.dest.join('/'), express.static(route.src))
  }

  let cacheSettings = {
    etag: true,
    setHeaders (res) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, no-cache')
    }
  }
  server.use('/music', express.static(path('..', 'music'), cacheSettings))
  server.use('/coverage', express.static(path('coverage', 'lcov-report')))

  server.listen(port, '0.0.0.0', function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('[webpack-dev-server]', 'http://localhost:' + port + '/')
  })
}
