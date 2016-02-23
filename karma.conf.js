
require('./node-environment')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'src/test/karma.js',
      { pattern: 'spec/**/*', watched: false, included: false, served: true, nocache: true },
    ],
    proxies: {
      '/spec/': '/base/spec/'
    },
    exclude: [
    ],
    preprocessors: {
      'src/test/karma.js': ['webpack', 'sourcemap'],
    },
    webpack: require('./config/webpack').generateKarmaConfig(),
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [process.env.BROWSER === 'firefox' ? 'Firefox' : 'Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
