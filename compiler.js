
var BMSChart = require('./bms-chart')

exports.compile = function(text) {

  var chart = new BMSChart()

  var result = {
    headerSentences: 0,
    channelSentences: 0,
    malformedSentences: 0,
    chart: chart,
  }

  eachLine(text, function(text, lineNumber) {
    void lineNumber
    if (text.charAt(0) !== '#') return
    match(text)
    .when(/^#(\d\d\d)(\S\S):(\S+)$/, function() {
      result.channelSentences += 1
    })
    .when(/^#(\w+)(?:\s+(\S.*))?$/, function(m) {
      result.headerSentences += 1
      chart.headers.set(m[1], m[2])
    })
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

function match(text) {
  var matched = false
  return {
    when: function(pattern, callback) {
      if (matched) return this
      var match = text.match(pattern)
      if (match) {
        matched = true
        callback(match)
      }
      return this
    },
    else: function(callback) {
      if (matched) return this
      callback()
    }
  }
}

