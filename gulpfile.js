
require('babel-core/register')
global.Promise = require('bluebird')

require('glob').sync('./tasks/*.js').forEach(function(file) { require(file) })

