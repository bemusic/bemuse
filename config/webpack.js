import * as Env from './env'

import Gauge from 'gauge'
import LoadProgressPlugin from '../src/hacks/webpack-progress'
import { flowRight } from 'lodash'
import path from './path'
import webpack from 'webpack'
import webpackResolve from './webpackResolve'
import { version } from './buildConfig'
import { GenerateSW } from 'workbox-webpack-plugin'

function generateBaseConfig () {
  let config = {
    mode: Env.production() ? 'production' : 'development',
    context: path('src'),
    resolve: webpackResolve,
    resolveLoader: {
      alias: {
        bemuse: path('src')
      }
    },
    devServer: {
      contentBase: false,
      publicPath: '/',
      stats: { colors: true, chunkModules: false }
    },
    module: {
      strictExportPresence: true,
      rules: generateLoadersConfig(),
      noParse: [/sinon\.js/]
    },
    plugins: [
      new CompileProgressPlugin(),
      new LoadProgressPlugin(),
      new webpack.ProvidePlugin({
        BemuseLogger: 'bemuse/logger'
      }),
      // Workaround A for `file-loader` (TODO: remove this when possible):
      // https://github.com/webpack/webpack/issues/6064
      new webpack.LoaderOptionsPlugin({
        options: {
          context: process.cwd()
        }
      }),
      new GenerateSW({
        swDest: 'service-worker.js',
        globDirectory: path('public/'),
        globPatterns: ['**/index.html'],
        exclude: [/\.(?:mp3|mp4|ogg|m4a)$/],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.+\/assets\/[^/]+\.bemuse$/,
            handler: 'cacheFirst',
            options: {
              cacheName: 'songs'
            }
          },
          {
            urlPattern: /^https?:\/\/.+\.(bms|bme|bml)$/,
            handler: 'cacheFirst',
            options: {
              cacheName: 'songs'
            }
          },
          {
            urlPattern: /^https?:\/\/.+\/index\.json$/,
            handler: 'cacheFirst',
            options: {
              cacheName: 'songs'
            }
          },
          {
            urlPattern: /^https?:\/\/.+\/assets\/metadata\.json$/,
            handler: 'cacheFirst',
            options: {
              cacheName: 'songs'
            }
          },
          {
            // To match cross-origin requests, use a RegExp that matches
            // the start of the origin:
            urlPattern: new RegExp('^https://fonts.googleapis.com/'),
            handler: 'staleWhileRevalidate',
            options: {
              cacheName: `skins-v${version}`,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https?:\/\/.+\/skins\//,
            handler: 'staleWhileRevalidate',
            options: {
              cacheName: `skins-v${version}`
            }
          },
          {
            urlPattern: /^https?:\/\/.+\/res\//,
            handler: 'staleWhileRevalidate',
            options: {
              cacheName: `site-v${version}`
            }
          },
          {
            urlPattern: /^https?:\/\/.+\.!(?:mp3|mp4|ogg|m4a)$/,
            handler: 'staleWhileRevalidate',
            options: {
              cacheName: `site-v${version}`
            }
          }
        ]
      })
    ]
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
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    },
    {
      test: /\.js$/,
      type: 'javascript/auto',
      include: [path('node_modules', 'pixi.js')],
      use: {
        loader: 'transform-loader/cacheable',
        options: {
          brfs: true
        }
      }
    },
    {
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'build/[name].[hash].[ext]'
        }
      }
    },
    {
      test: /\.json$/,
      type: 'javascript/auto',
      loader: 'json-loader'
    },
    {
      test: /\.pegjs$/,
      loader: 'pegjs-loader'
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('autoprefixer')({
                flexbox: 'no-2009'
              })
            ]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'expanded'
          }
        }
      ]
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('autoprefixer')({
                flexbox: 'no-2009'
              })
            ]
          }
        }
      ]
    },
    {
      test: /\.jade$/,
      loader: 'jade-loader'
    },
    {
      test: /\.png$/,
      loader: 'url-loader',
      options: {
        limit: 100000,
        mimetype: 'image/png',
        name: 'build/[name].[hash].[ext]'
      }
    },
    {
      test: /\.jpg$/,
      loader: 'file-loader',
      options: {
        name: 'build/[name].[hash].[ext]'
      }
    },
    {
      test: /\.(?:mp3|mp4|ogg|m4a)$/,
      loader: 'file-loader',
      options: {
        name: 'build/[name].[hash].[ext]'
      }
    },
    {
      test: /\.(otf|eot|svg|ttf|woff|woff2)(?:$|\?)/,
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'build/[name].[hash].[ext]'
      }
    }
  ]
}

function applyWebConfig (config) {
  Object.assign(config, {
    entry: {
      boot: ['./boot']
    },
    output: {
      path: path('dist'),
      globalObject: 'this',
      filename: 'build/[name].js',
      chunkFilename: 'build/[name]-[chunkhash].js',
      devtoolModuleFilenameTemplate: 'file://[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate:
        'file://[absolute-resource-path]?[hash]'
    }
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

export const generateWebConfig = flowRight(
  applyWebConfig,
  generateBaseConfig
)

export const generateKarmaConfig = flowRight(
  applyKarmaConfig,
  generateBaseConfig
)

export const generateTestBedConfig = flowRight(
  applyTestBedConfig,
  generateBaseConfig
)

export default generateWebConfig()

function CompileProgressPlugin () {
  const gauge = new Gauge()
  return new webpack.ProgressPlugin(function (percentage, message) {
    if (percentage === 1) gauge.hide()
    else gauge.show(message, percentage)
  })
}
