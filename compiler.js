
exports.compile = function(text) {

  var result = {
    headerSentences: 0,
    channelSentences: 0,
    malformedSentences: 0,
  }

  eachLine(text, function(text, lineNumber) {
    void lineNumber
    if (text.charAt(0) !== '#') return
    if (text.match(/^#(\d\d\d)(\S\S):(\S+)$/)) {
      result.channelSentences += 1
    } else if (text.match(/^#(\w+)(?:\s+(\S.*))?$/)) {
      result.headerSentences += 1
    }
  })

  return result

}

function eachLine(text, callback) {
  text.split(/\r\n|\r|\n/)
      .map(function(line) { return line.trim() })
      .forEach(function(line, index) {
    callback(line, index + 1)
  })
}

