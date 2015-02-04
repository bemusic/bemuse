
require('6to5/register')
global.Promise = require('bluebird')

require('glob').sync('./tasks/*.js').forEach(function(file) { require(file) })

