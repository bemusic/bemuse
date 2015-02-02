
import path     from './path'
import NODE_ENV from 'node-env'
import webpack  from 'webpack'

let config = {
  context: path('src'),
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
        test: /[\\\/]src[\\\/].*\.js$/,
        loader: '6to5?modules=common&experimental=true',
      },
      {
        test: /[\\\/]spec[\\\/].*\.js$/,
        loader: '6to5?modules=common&experimental=true',
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
    ],
    postLoaders: [],
  },
  plugins: [],
}

if (NODE_ENV === 'test' || process.env.COV === 'true') {
  config.module.postLoaders.push({
    test: /\/src\/.*\.js$/,
    exclude: /\/src\/test\/.*\.js$|\/src\/boot\/loader\.js$/,
    loader: 'istanbul-instrumenter',
  })
}

if (NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  )
}

export default config
