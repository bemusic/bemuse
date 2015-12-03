
require('./node-environment')
require('glob').sync('./tasks/*.js').forEach(function (file) { require(file) })
