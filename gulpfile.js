
require('6to5/register')
require('glob').sync('./tasks/*.js').forEach(function(file) { require(file) })

