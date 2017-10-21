import * as Env from './env'

import Gauge from 'gauge'
import LoadProgressPlugin from '../src/hacks/webpack-progress'
import { flowRight } from 'lodash'
import path from './path'
import webpack from 'webpack'
import webpackResolve from './webpackResolve'

function generateBaseConfig () {
  let config = {
    context: path('src'),
    resolve: webpackResolve,
    resolveLoader: {
      alias: {
        bemuse: path('src'),
      },
    },
    devServer: {
      contentBase: false,
      publicPath: '/build/',
      stats: { colors: true, chunkModules: false },
    },
    module: {
      loaders: generateLoadersConfig(),
      noParse: [
        /sinon\.js/,
      ],
    },
    plugins: [
      new CompileProgressPlugin(),
      new LoadProgressPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(String(process.env.NODE_ENV))
        }
      }),
      new webpack.ProvidePlugin({
        BemuseLogger: 'bemuse/logger'
      })
    ],
  }

  if (Env.sourceMapsEnabled() && Env.development()) {
    config.devtool = 'eval-source-map'
  } else if (Env.sourceMapsEnabled() || Env.production()) {
    config.devtool = 'source-map'
  } else if (Env.development()) {
    config.devtool = 'eval'
  }

  return config
}

function generateLoadersConfig () {
  return [
    {
      test: /\.jsx?$/,
      include: [path('src'), path('spec')],
      loader: 'babel-loader?cacheDirectory',
    },
    {
      test: /\.js$/,
      include: [path('node_modules', 'pixi.js')],
      loader: 'transform-loader/cacheable?brfs',
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.pegjs$/,
      loader: 'pegjs-loader',
    },
    {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version' +
              '!sass-loader?outputStyle=expanded'
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version',
    },
    {
      test: /\.jade$/,
      loader: 'jade-loader',
    },
    {
      test: /\.png$/,
      loader: 'url-loader?limit=100000&mimetype=image/png',
    },
    {
      test: /\.jpg$/,
      loader: 'file-loader',
    },
    {
      test: /\.(?:mp3|mp4|ogg|m4a)$/,
      loader: 'file-loader',
    },
    {
      test: /\.(otf|eot|svg|ttf|woff|woff2)(?:$|\?)/,
      loader: 'url-loader?limit=8192'
    },
  ]
}


function applyWebConfig (config) {
  Object.assign(config, {
    entry: {
      boot: [ './boot' ]
    },
    output: {
      path: path('dist', 'build'),
      publicPath: 'build/',
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      devtoolModuleFilenameTemplate: 'file://[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: 'file://[absolute-resource-path]?[hash]',
    },
  })

  if (Env.hotModeEnabled()) {
    config.devServer.hot = true
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    )
    config.entry.boot.unshift(
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://' + Env.serverHost() + ':' + Env.serverPort(),
      'webpack/hot/only-dev-server'
    )
  }

  if (Env.production()) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin())
  }

  return config
}


function applyKarmaConfig (config) {
  config.devtool = 'cheap-inline-source-map'
  return config
}


function applyTestBedConfig (config) {
  config.entry = './test/testBed.entry.js'
  config.testBed = {
    configureExpressApp: (app, express) => {
      app.use('/src', express.static(path('src')))
    }
  }
  return config
}


export const generateWebConfig = flowRight(applyWebConfig, generateBaseConfig)

export const generateKarmaConfig = flowRight(applyKarmaConfig, generateBaseConfig)

export const generateTestBedConfig = flowRight(applyTestBedConfig, generateBaseConfig)

export default generateWebConfig()


function CompileProgressPlugin () {
  const gauge = new Gauge()
  return new webpack.ProgressPlugin(function (percentage, message) {
    if (percentage === 1) gauge.hide()
    else gauge.show(message, percentage)
  })
}
