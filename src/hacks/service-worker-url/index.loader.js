
module.exports = function(buffer) {
  return 'module.exports = ' + buffer.toString().match(/register\((.*?), options/)[1]
}
