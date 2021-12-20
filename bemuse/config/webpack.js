import * as Env from './env'

import Gauge from 'gauge'
import { flowRight } from 'lodash'
import path from './path'
import webpack from 'webpack'
import webpackResolve from './webpackResolve'
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

function generateBaseConfig() {
  let config = {
    mode: Env.production() ? 'production' : 'development',
    context: path('src'),
    resolve: webpackResolve,
    resolveLoader: {
      alias: {
        bemuse: path('src'),
      },
    },
    devServer: {
      contentBase: false,
      publicPath: '/',
      stats: { colors: true, chunkModules: false },
      disableHostCheck: true,
    },
    module: {
      strictExportPresence: true,
      rules: generateLoadersConfig(),
      noParse: [/sinon\.js/],
    },
    plugins: [
      new CompileProgressPlugin(),
      new webpack.ProvidePlugin({
        BemuseLogger: 'bemuse/logger',
      }),
      // Workaround A for `file-loader` (TODO: remove this when possible):
      // https://github.com/webpack/webpack/issues/6064
      new webpack.LoaderOptionsPlugin({
        options: {
          context: process.cwd(),
        },
      }),
      new ServiceWorkerWebpackPlugin({
        entry: path('src/app/service-worker.js'),
      }),
    ],
  }

  if (Env.production()) {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: { semicolons: false },
          },
        }),
      ],
    }
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

function generateLoadersConfig() {
  return [
    {
      test: /\.[jt]sx?$/,
      include: [path('src'), path('spec')],
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            module: 'es6',
          },
        },
      },
    },
    ...(Env.coverageEnabled()
      ? [
          {
            test: /\.[jt]sx?$/,
            include: [path('src')],
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true },
            },
            enforce: 'post',
          },
        ]
      : []),
    {
      test: /\.js$/,
      type: 'javascript/auto',
      include: [path('node_modules', 'pixi.js')],
      use: {
        loader: 'transform-loader/cacheable',
        options: {
          brfs: true,
        },
      },
    },
    {
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'build/[hash].worker.js',
        },
      },
    },
    {
      test: /\.json$/,
      type: 'javascript/auto',
      loader: 'json-loader',
    },
    {
      test: /\.pegjs$/,
      loader: 'pegjs-loader',
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('autoprefixer')({
                flexbox: 'no-2009',
              }),
            ],
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              outputStyle: 'expanded',
            },
          },
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('autoprefixer')({
                flexbox: 'no-2009',
              }),
            ],
          },
        },
      ],
    },
    {
      test: /\.jade$/,
      loader: 'jade-loader',
    },
    {
      test: /\.png$/,
      loader: 'url-loader',
      options: {
        limit: 100000,
        mimetype: 'image/png',
        name: 'build/[hash].[ext]',
      },
    },
    {
      test: /\.jpg$/,
      loader: 'file-loader',
      options: {
        name: 'build/[hash].[ext]',
      },
    },
    {
      test: /\.(?:mp3|mp4|ogg|m4a)$/,
      loader: 'file-loader',
      options: {
        name: 'build/[hash].[ext]',
      },
    },
    {
      test: /\.(otf|eot|svg|ttf|woff|woff2)(?:$|\?)/,
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'build/[hash].[ext]',
      },
    },
  ]
}

function applyWebConfig(config) {
  Object.assign(config, {
    entry: {
      boot: ['./boot'],
    },
    output: {
      path: path('dist'),
      publicPath: '/',
      globalObject: 'this',
      filename: 'build/[name].js',
      chunkFilename: 'build/[name]-[chunkhash].js',
      devtoolModuleFilenameTemplate: 'file://[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate:
        'file://[absolute-resource-path]?[hash]',
    },
  })

  if (Env.hotModeEnabled()) {
    config.devServer.hot = true
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.entry.boot.unshift(
      'webpack-dev-server/client?http://' +
        Env.serverHost() +
        ':' +
        Env.serverPort(),
      'webpack/hot/only-dev-server'
    )
  }

  return config
}

function applyKarmaConfig(config) {
  config.devtool = 'cheap-inline-source-map'
  return config
}

export const generateWebConfig = flowRight(applyWebConfig, generateBaseConfig)

export const generateKarmaConfig = flowRight(
  applyKarmaConfig,
  generateBaseConfig
)

export default generateWebConfig()

function CompileProgressPlugin() {
  const gauge = new Gauge()
  return new webpack.ProgressPlugin(function (percentage, message) {
    if (percentage === 1) gauge.hide()
    else gauge.show(message, percentage)
  })
}
