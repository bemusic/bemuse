
// Destroys the source map from sass-loader in order to work around these:
//
// - https://github.com/passy/autoprefixer-loader/issues/17
// - https://github.com/jtangelder/sass-loader/pull/57
//
module.exports = function(content) {
  this.callback(null, content)
}
