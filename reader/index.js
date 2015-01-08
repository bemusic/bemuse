
var chardet = require('chardet')
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

