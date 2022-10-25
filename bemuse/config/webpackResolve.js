'use strict'

const path = require('./path')

module.exports = {
  alias: {
    bemuse: path('src'),
  },
  extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx'],
  fallback: {
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer/'),
    events: require.resolve('events/'),
    fs: false,
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
  },
}
