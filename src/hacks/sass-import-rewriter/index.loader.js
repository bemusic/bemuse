// Hack to rewrite @import statement in Sass files.
//
// Need to do this because we want to be able to @import Sass files like this::
//
//   @import "~bemuse/ui/common";
//
// However, this is not possible in sass-loader v0.4.2.
// https://github.com/jtangelder/sass-loader/tree/859c91a
//
// This is possible in sass-loader v1.0.1,
// but it depends on a beta version of node-sass,
// which currently crashes on Mac OS X.
// https://github.com/jtangelder/sass-loader/tree/v1.0.1
//
var RE = /@import\s+"~([^"]+)"/g
var path = require('path')
var Promise = require('bluebird')

module.exports = function(contents) {

  this.cacheable()

  var that    = this
  var source  = contents.toString('utf8')
  var paths   = []
  var resolve = Promise.promisify(this.resolve, this)
  var map     = {}

  // 1. Scan the @import statements.
  source.replace(RE, function(a, pathspec) {
    paths.push(pathspec)
  })

  // 2. For each import statement, we resolve the `.scss` file.
  Promise
  .each(paths, function(pathspec) {
    return resolve(that.context, pathspec + '.scss').then(function(scss) {
      map[pathspec] = path.relative(path.dirname(that.resourcePath), scss)
    })
  })

  // 3. Replace the source with the resolved file.
  .then(function() {
    return new Buffer(source.replace(RE, function(a, pathspec) {
      var result = '@import "' + map[pathspec] + '"'
      return result
    }))
  })

  // 4. Call the callback.
  .nodeify(this.async())

}
