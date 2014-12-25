
import path     from './path'
import NODE_ENV from 'node-env'

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
  },
  devServer: {
    contentBase: false,
    publicPath: '/build/',
    stats: { colors: true },
  },
  module: {
    loaders: [
      {
        test: /\/src\/.*\.js$/,
        loader: '6to5?modules=commonInterop&experimental=true',
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
}

if (NODE_ENV === 'test') {
  config.module.postLoaders.push({
    test: /\/src\/.*\.js$/,
    loader: 'istanbul-instrumenter',
  })
}

export default config

