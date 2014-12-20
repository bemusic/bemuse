
var glob = require('glob')
var list = glob.sync('./**/*_spec.js', { cwd: __dirname })

module.exports = list.map(function(filename) {
  return 'require(' + JSON.stringify(filename) + ');\n'
}).join('')
