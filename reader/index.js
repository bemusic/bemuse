
var chardet = require('bemuse-chardet/bemuse-chardet')
var iconv = require('iconv-lite')

exports.read = function read(buffer) {
  var charset = chardet.detect(buffer)
  var text = iconv.decode(buffer, charset)
  if (text.charCodeAt(0) === 0xFEFF) { // BOM?!
    return text.substr(1)
  } else {
    return text
  }
}

exports.readAsync = function read(buffer, callback) {
  setTimeout(function() {
    var result
    try {
      result = { value: exports.read(buffer) }
    } catch (e) {
      result = { error: e }
    }
    if (result.error) {
      callback(result.error)
    } else {
      callback(null, result.value)
    }
  })
}
