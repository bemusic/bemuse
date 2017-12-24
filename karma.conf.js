require('./node-environment')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'src/test/karma.js',
      {
        pattern: 'src/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: true
      }
    ],
    proxies: {
      '/spec/': '/base/spec/',
      '/src/': '/base/src/'
    },
    exclude: [],
    preprocessors: {
      'src/test/karma.js': ['webpack', 'sourcemap']
    },
    webpack: require('./config/webpack').generateKarmaConfig(),
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [process.env.BROWSER || 'ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  })
}
