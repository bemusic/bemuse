'use strict'

module.exports = {
  extends: [
    'plugin:import/errors'
  ],
  plugins: [
    'import'
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: require.resolve('./webpack.config.resolver.js')
      }
    },
    'import/ignore': [
      'node_modules',
      '\\.(jade|scss|pegjs)$',
      'version\\.js$',
      'worker\\.js$',
      'webpack-progress',
      'config\\.js$',
      '/config/',
      '/tasks/',
    ]
  }
}
