
import webpack        from 'webpack'
import ProgressPlugin from '../src/hacks/webpack-progress'
import path           from './path'
import * as Env       from './env'
import { flowRight }  from 'lodash'
import Gauge          from 'gauge'

function generateBaseConfig () {
  let config = {
    context: path('src'),
    resolve: {
      alias: {
        bemuse: path('src'),
      },
      extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },
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
      postLoaders: [],
      preLoaders: [],
      noParse: [
        /node_modules\/sinon\//,
      ],
    },
    plugins: [
      new CompileProgressPlugin(),
      new ProgressPlugin(),
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
      loader: 'babel?cacheDirectory',
    },
    {
      test: /\.js$/,
      include: [path('node_modules', 'pixi.js')],
      loader: 'transform/cacheable?brfs',
    },
    {
      test: /\.json$/,
      loader: 'json',
    },
    {
      test: /\.pegjs$/,
      loader: 'pegjs',
    },
    {
      test: /\.scss$/,
      loader: 'style!css!autoprefixer?browsers=last 2 version' +
              '!sass?outputStyle=expanded'
    },
    {
      test: /\.css$/,
      loader: 'style!css!autoprefixer?browsers=last 2 version',
    },
    {
      test: /\.jade$/,
      loader: 'jade',
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
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.entry.boot.unshift('webpack-dev-server/client?http://' + Env.serverHost() + ':' + Env.serverPort())
    config.entry.boot.unshift('webpack/hot/dev-server')
  }

  if (Env.production()) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    )
  }

  return config
}


function applyKarmaConfig (config) {
  config.devtool = 'cheap-inline-source-map'
  return config
}


export const generateWebConfig = flowRight(applyWebConfig, generateBaseConfig)

export const generateKarmaConfig = flowRight(applyKarmaConfig, generateBaseConfig)

export default generateWebConfig()


function CompileProgressPlugin () {
  const gauge = new Gauge()
  return new webpack.ProgressPlugin(function (percentage, message) {
    if (percentage === 1) gauge.hide()
    else gauge.show(message, percentage)
  })
}
