
require('dotenv').load()
require('babel-register')
require('babel-polyfill')
global.Promise = require('bluebird')
