/* global FileReader, Blob */
var chardet = require('bemuse-chardet/bemuse-chardet')

export function read (buffer) {
  throw new Error('Synchronous read unsupported in browser!')
}

export function readAsync (buffer, callback) {
  var charset = chardet.detect(buffer)
  var reader = new FileReader()
  reader.onload = function () {
    callback(null, reader.result)
  }
  reader.onerror = function () {
    callback(new Error('cannot read it'))
  }
  reader.readAsText(new Blob([buffer]), charset)
}
