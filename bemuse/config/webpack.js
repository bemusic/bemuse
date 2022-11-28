import Gauge from 'gauge'
import TerserPlugin from 'terser-webpack-plugin'
import express from 'express'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { ServiceWorkerPlugin } from 'service-worker-webpack'
import { flowRight } from 'lodash'

import * as Env from './env'
import path from './path'
import routes from './routes'
import webpackResolve from './webpackResolve'

function generateBaseConfig() {
  const config = {
    mode: Env.production() ? 'production' : 'development',
    context: path('src'),
    resolve: webpackResolve,
    resolveLoader: {
      alias: {
        bemuse: path('src'),
      },
    },
    devServer: {
      allowedHosts: 'all',
      static: false,
      devMiddleware: {
        publicPath: '/',
        stats: { colors: true, chunkModules: false },
      },
      setupMiddlewares: (middlewares, devServer) => {
        devServer.app.use('/', express.static(path('..', 'public')))
        for (const route of routes) {
          devServer.app.use(
            '/' + route.dest.join('/'),
            express.static(route.src)
          )
        }
        const cacheSettings = {
          etag: true,
          setHeaders(res) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, no-cache')
          },
        }
        devServer.app.use(
          '/music',
          express.static(path('..', 'music'), cacheSettings)
        )
        devServer.app.use(
          '/coverage',
          express.static(path('coverage', 'lcov-report'))
        )
        return middlewares
      },
    },
    module: {
      strictExportPresence: true,
      exprContextCritical: false,
      rules: generateLoadersConfig(),
      noParse: [/sinon\.js/],
    },
    plugins: [
      new CompileProgressPlugin(),
      new webpack.ProvidePlugin({
        BemuseLogger: 'bemuse/logger',
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
      new ServiceWorkerPlugin({
        enableWorkboxLogging: true,
        registration: {
          entry: 'boot',
        },
        workbox: {
          manifestTransforms: [
            (manifest) => {
              manifest.push({ url: '/', revision: null })
              return { manifest }
            },
          ],
          navigateFallback: '/',
          navigateFallbackAllowlist: [/^\/(?:\?.*)?$/],
          runtimeCaching: [
            // Cache all .bemuse files.
            // These files are hashed, so the CacheFirst strategy is safe.
            {
              urlPattern: /^.*\.bemuse$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'bemuse-song-assets',
                cacheableResponse: { statuses: [200] },
              },
            },
            // Cache chart files.
            // These files may be updated, so we use the NetworkFirst strategy.
            {
              urlPattern: /^.*\.(bms|bme|bml|bmson)$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'bemuse-song-charts',
                cacheableResponse: { statuses: [200] },
              },
            },
            // Cache music server files.
            // These files may be updated, so we use the NetworkFirst strategy.
            {
              urlPattern: /^.*\/index\.json$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'bemuse-servers',
                cacheableResponse: { statuses: [200] },
              },
            },
            // Cache asset metadata files.
            // These files may be updated, so we use the NetworkFirst strategy.
            {
              urlPattern: /^.*\/metadata\.json$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'bemuse-song-assets',
                cacheableResponse: { statuses: [200] },
              },
            },
            // Cache skin files.
            // These files do not change frequently, so we use the StaleWhileRevalidate strategy.
            {
              urlPattern: /^\/skins\//,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'bemuse-skin',
                cacheableResponse: { statuses: [200] },
              },
            },
            // Cache resource files.
            // These files do not change frequently, so we use the StaleWhileRevalidate strategy.
            {
              urlPattern: /^\/res\//,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'bemuse-res',
                cacheableResponse: { statuses: [200] },
              },
            },
            // Cache video files.
            // These files may be updated, so we use the NetworkFirst strategy.
            {
              urlPattern: /^.*\.(mp4|webm)$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'bemuse-videos',
                cacheableResponse: { statuses: [200] },
                rangeRequests: true,
              },
            },
          ],
          skipWaiting: true,
          clientsClaim: true,
        },
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'build/report/index.html',
        generateStatsFile: true,
        statsFilename: 'build/report/stats.json',
        openAnalyzer: false,
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
    ...(Env.coverageEnabled()
      ? [
          {
            test: /\.[jt]sx?$/,
            resourceQuery: { not: [/raw/] },
            include: [path('src')],
            use: {
              loader: '@ephesoft/webpack.istanbul.loader',
              options: { esModules: true },
            },
            enforce: 'post',
          },
        ]
      : []),
    {
      test: /\.spec\.js$/,
      use: [
        {
          loader: 'webpack-espower-loader',
        },
      ],
    },
    {
      test: /\.[jt]sx?$/,
      include: [path('src'), path('spec')],
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            module: 'esnext',
            moduleResolution: 'node',
          },
        },
      },
    },
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
            postcssOptions: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
                  flexbox: 'no-2009',
                }),
              ],
            },
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
            postcssOptions: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        },
      ],
    },
    {
      test: /\.jade$/,
      loader: 'pug-loader',
    },
    {
      test: /\.png$/,
      type: 'asset',
    },
    {
      test: /\.jpg$/,
      type: 'asset/resource',
    },
    {
      test: /\.(?:mp3|mp4|ogg|m4a)$/,
      type: 'asset/resource',
    },
    {
      test: /\.(otf|eot|svg|ttf|woff|woff2)(?:$|\?)/,
      type: 'asset',
    },
    {
      test: /\.(?:md)$/,
      type: 'asset/source',
    },
    {
      resourceQuery: /raw/,
      type: 'asset/source',
    },
  ]
}

function applyWebConfig(config) {
  Object.assign(config, {
    entry: {
      boot: ['./boot'],
    },
    output: {
      publicPath: '/',
      globalObject: 'this',
      filename: 'build/[name].js',
      assetModuleFilename: 'build/assets/[name]-[hash][ext][query]',
      chunkFilename: 'build/[name]-[chunkhash].js',
      devtoolModuleFilenameTemplate: 'file://[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate:
        'file://[absolute-resource-path]?[contenthash]',
    },
  })

  if (Env.hotModeEnabled()) {
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
  config.devtool = 'inline-cheap-source-map'
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
