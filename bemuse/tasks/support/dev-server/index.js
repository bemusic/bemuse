import WebpackDevServer from 'webpack-dev-server'
import chalk from 'chalk'
import express from 'express'
import log from 'fancy-log'
import PluginError from 'plugin-error'
import webpack from 'webpack'

import * as Env from '../../../config/env'
import buildConfig from '../../../config/buildConfig'
import config from '../../../config/webpack'
import path from '../../../config/path'
import routes from '../../../config/routes'

export function start() {
  console.log(
    chalk.redBright('⬤'),
    chalk.yellowBright('▗▚▚▚'),
    chalk.bold(buildConfig.name),
    chalk.cyan(buildConfig.version)
  )

  const port = Env.serverPort()
  const compiler = webpack(config)
  const server = new WebpackDevServer(compiler, config.devServer)

  server.use('/', express.static(path('..', 'public')))
  for (const route of routes) {
    server.use('/' + route.dest.join('/'), express.static(route.src))
  }

  const cacheSettings = {
    etag: true,
    setHeaders(res) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, no-cache')
    },
  }
  server.use('/music', express.static(path('..', 'music'), cacheSettings))
  server.use('/coverage', express.static(path('coverage', 'lcov-report')))

  server.listen(port, '0.0.0.0', function (err) {
    if (err) throw new PluginError('webpack-dev-server', err)
    log('[webpack-dev-server]', 'http://localhost:' + port + '/')
  })
}
