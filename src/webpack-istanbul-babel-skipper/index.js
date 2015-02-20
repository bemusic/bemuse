
module.exports = function(contents) {
  let source = contents.toString('utf-8')
  return new Buffer(
    source.replace(/var _\w+ = function \(/g, '/* istanbul ignore next */ $&'))
}
