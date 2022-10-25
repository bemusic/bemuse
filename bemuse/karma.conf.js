require('./node-environment')

const { join } = require('path')
const { tmpdir } = require('os')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'
process.env.CHROME_BIN = require('puppeteer').executablePath()

const output = {
  path: join(tmpdir(), '_karma_webpack') + Math.floor(Math.random() * 1000000),
}

module.exports = function (config) {
  config.set({
    // Make Karma work with pnpm.
    // See: https://github.com/pnpm/pnpm/issues/720#issuecomment-954120387
    plugins: Object.keys(require('./package').devDependencies).flatMap(
      (packageName) => {
        if (!packageName.startsWith('karma-')) return []
        return [require(packageName)]
      }
    ),

    basePath: '',
    frameworks: ['mocha', 'webpack', 'power-assert'],
    files: [
      'src/test/karma.js',
      {
        pattern: `${output.path}/**/*`,
        watched: false,
        included: false,
      },
      {
        pattern: 'src/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: true,
      },
    ],
    proxies: {
      '/spec/': '/base/spec/',
      '/src/': '/base/src/',
    },
    exclude: [],
    preprocessors: {
      'src/test/karma.js': ['webpack', 'sourcemap'],
      'src/test/**/*.spec.js': ['espower'],
    },
    webpack: {
      ...require('./config/webpack').generateKarmaConfig(),
      output,
    },
    webpackMiddleware: {
      noInfo: true,
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
    browsers: [process.env.BROWSER || 'ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,
  })
}
