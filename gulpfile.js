
require('6to5/register')
require('prfun')
require('glob').sync('./tasks/*.js').forEach(function(file) { require(file) })

