require('./node-environment')
require('gulp').registry(require('undertaker-forward-reference')())
require('glob')
  .sync('./tasks/*.js')
  .forEach(function(file) {
    require(file)
  })
