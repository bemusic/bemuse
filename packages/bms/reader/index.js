
// Public: A module that takes a buffer, detects the character set, and
// returns the decoded string.
//
// The Reader follows [ruv-it!’s algorithm](http://hitkey.nekokan.dyndns.info/cmds.htm#CHARSET)
// for detecting the character set.
//
/* module */

var chardet = require('bemuse-chardet/bemuse-chardet')
var iconv = require('iconv-lite')

// Public: Reads the buffer, detect the character set, and returns the decoded
// string synchronously.
//
// * `buffer` {Buffer} representing the BMS file
//
// Returns a {String} representing the decoded text
//
exports.read = function read (buffer) {
  var charset = chardet.detect(buffer)
  var text = iconv.decode(buffer, charset)
  if (text.charCodeAt(0) === 0xFEFF) { // BOM?!
    return text.substr(1)
  } else {
    return text
  }
}

// Public: Like `read(buffer)`, but this is the asynchronous version.
//
// * `buffer` {Buffer} representing the BMS file
// * `callback` {Function} that will be called when finished
//   * `error` {Error} in case of failure
//   * `value` {String} representing the decoded text
//
exports.readAsync = function read (buffer, callback) {
  setTimeout(function () {
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
