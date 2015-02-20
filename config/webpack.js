
import path           from './path'
import NODE_ENV       from 'node-env'
import webpack        from 'webpack'
import ProgressPlugin from '../src/webpack-progress'

let config = {
  context: path('src'),
  resolve: {
    alias: {
      bemuse: path('src'),
      assets: path('assets'),
    },
  },
  resolveLoader: {
    alias: {
      bemuse: path('src'),
    },
  },
  entry: {
    boot: './boot'
  },
  devtool: 'source-map',
  output: {
    path: path('dist', 'build'),
    publicPath: 'build/',
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
  },
  devServer: {
    contentBase: false,
    publicPath: '/build/',
    stats: { colors: true },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path('src'), path('spec')],
        loader: 'babel?modules=common&experimental=true',
      },
      {
        test: /\.pegjs/,
        loader: 'pegjs',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer?browsers=last 2 version' +
                '!sass?outputStyle=expanded',
      },
      {
        test: /\.css$/,
        loader: 'style!css!autoprefixer?browsers=last 2 version',
      },
      {
        test: /\.jade/,
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
    ],
    postLoaders: [],
  },
  plugins: [
    new ProgressPlugin(),
  ],
}

if (NODE_ENV === 'test' || process.env.COV === 'true') {
  config.module.postLoaders.push({
    test: /\.js$/,
    include: [path('src')],
    exclude: [
      path('src', 'test'),
      path('src', 'polyfill'),
      path('src', 'boot', 'loader.js'),
    ],
    loader: 'istanbul-instrumenter!bemuse/webpack-istanbul-babel-skipper',
  })
}

if (NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  )
}

export default config
