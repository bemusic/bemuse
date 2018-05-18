require('dotenv').load()
require('babel-register')({
  plugins: ['transform-es2015-modules-commonjs']
})
require('babel-polyfill')
global.Promise = require('bluebird')
