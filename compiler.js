
var BMSChart = require('./bms/chart')

exports.compile = function(text) {

  var chart = new BMSChart()

  var result = {
    headerSentences: 0,
    channelSentences: 0,
    malformedSentences: 0,
    chart: chart,
    warnings: []
  }

  eachLine(text, function(text, lineNumber) {
    void lineNumber
    if (text.charAt(0) !== '#') return
    match(text)
    .when(/^#(\d\d\d)02:(\S*)$/, function(m) {
      result.channelSentences += 1
      chart.timeSignatures.set(+m[1], +m[2])
    })
    .when(/^#(\d\d\d)(\S\S):(\S*)$/, function(m) {
      result.channelSentences += 1
      handleChannelSentence(+m[1], m[2], m[3], lineNumber)
    })
    .when(/^#(\w+)(?:\s+(\S.*))?$/, function(m) {
      result.headerSentences += 1
      chart.headers.set(m[1], m[2])
    })
    .else(function() {
      warn(lineNumber, 'Invalid command')
    })
  })

  return result

  function handleChannelSentence(measure, channel, string, lineNumber) {
    var items = Math.floor(string.length / 2)
    if (items === 0) return
    for (var i = 0; i < items; i ++) {
      var value = string.substr(i * 2, 2)
      var fraction = i / items
      if (value === '00') continue
      chart.objects.add({
        measure: measure, 
        fraction: fraction,
        value: value,
        channel: channel,
        lineNumber: lineNumber,
      })
    }
  }

  function warn(lineNumber, message) {
    result.warnings.push({
      lineNumber: lineNumber,
      message: message,
    })
  }

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

