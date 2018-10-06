require('dotenv').load()
require('@babel/register')({
  plugins: ['@babel/plugin-transform-modules-commonjs']
})
require('@babel/polyfill')
global.Promise = require('bluebird')
