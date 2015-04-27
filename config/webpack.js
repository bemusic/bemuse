
import path           from './path'
import * as Env       from './env'
import webpack        from 'webpack'
import ProgressPlugin from '../src/hacks/webpack-progress'

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
  entry: {
    boot: './boot'
  },
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
        test: /\.jsx?$/,
        include: [path('src'), path('spec')],
        loader: 'babel?modules=common&experimental=true',
      },
      {
        test: /\.pegjs$/,
        loader: 'pegjs',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer?browsers=last 2 version' +
                '!sass?outputStyle=expanded' +
                '!bemuse/hacks/sass-import-rewriter',
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
    ],
    postLoaders: [],
    preLoaders: [],
  },
  plugins: [
    new CompileProgressPlugin(),
    new ProgressPlugin(),
  ],
}

function CompileProgressPlugin() {
  var old = ''
  return new webpack.ProgressPlugin(function(percentage, message) {
    var text = '['
    for (var i = 0; i < 20; i++) text += percentage >= i / 20 ? '=' : ' '
    text += '] ' + message
    var clear = ''
    for (i = 0; i < old.length; i++) clear += '\r \r'
    process.stderr.write(clear + text)
    old = text
  })
}

if (process.env.SOURCE_MAPS === 'true' || Env.production()) {
  config.devtool = 'source-map'
}

if (Env.test() || process.env.BEMUSE_COV === 'true') {
  config.module.preLoaders.push({
    test: /\.js$/,
    include: [path('src')],
    exclude: [
      path('src', 'test'),
      path('src', 'polyfill'),
      path('src', 'boot', 'loader.js'),
    ],
    loader: 'isparta-instrumenter',
  })
}

if (Env.production()) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  )
}

export default config
