import WebpackDevServer from 'webpack-dev-server'
import chalk from 'chalk'
import log from 'fancy-log'
import PluginError from 'plugin-error'
import webpack from 'webpack'

import * as Env from '../../../config/env'
import buildConfig from '../../../config/buildConfig'
import config from '../../../config/webpack'

export function start() {
  console.log(
    chalk.redBright('⬤'),
    chalk.yellowBright('▗▚▚▚'),
    chalk.bold(buildConfig.name),
    chalk.cyan(buildConfig.version)
  )

  const port = Env.serverPort()
  const compiler = webpack(config)
  const server = new WebpackDevServer(
    {
      ...config.devServer,
      host: '0.0.0.0',
      port,
    },
    compiler
  )

  server.startCallback(function (err) {
    if (err) throw new PluginError('webpack-dev-server', err)
    log('[webpack-dev-server]', 'http://localhost:' + port + '/')
  })
}
