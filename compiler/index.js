
// Public: A module that takes a string representing the BMS notechart,
// parses it, and compiles into a {BMSChart}.
/* module */

var match = require('../util/match')
var BMSChart = require('../bms/chart')

// Public: Reads the string representing the BMS notechart, parses it,
// and compiles into a {BMSChart}.
//
// * `text` {String} representing the BMS notechart
// * `options` (optional) {Object} representing additional parser options
//   * `rng` (option) {Function} that generates a random number.
//     It is used when processing `#RANDOM n` directive.
//     This function should return an integer number between 1 and `n`.
//     * `max` {Number} representing the maximum value.
//
// Returns an {Object} with these keys:
//   * `chart` {BMSChart} representing the resulting chart
//   * `warnings` {Array} of warnings. Each warning is an {Object} with these keys:
//     * `lineNumber` {Number} representing the line number where this warning occurred
//     * `message` {String} representing the warning message
//
exports.compile = function (text, options) {

  options = options || { }

  var chart = new BMSChart()

  var rng = options.rng || function (max) {
    return 1 + Math.floor(Math.random() * max)
  }

  var randomStack = []
  var skipStack = [false]

  var result = {
    headerSentences: 0,
    channelSentences: 0,
    controlSentences: 0,
    skippedSentences: 0,
    malformedSentences: 0,
    chart: chart,
    warnings: []
  }

  eachLine(text, function (text, lineNumber) {
    var flow = true
    if (text.charAt(0) !== '#') return
    match(text)
    .when(/^#RANDOM\s+(\d+)$/i, function (m) {
      result.controlSentences += 1
      randomStack.push(rng(+m[1]))
    })
    .when(/^#IF\s+(\d+)$/i, function (m) {
      result.controlSentences += 1
      skipStack.push(randomStack[randomStack.length - 1] !== +m[1])
    })
    .when(/^#ENDIF$/i, function (m) {
      result.controlSentences += 1
      skipStack.pop()
    })
    .else(function () {
      flow = false
    })
    if (flow) return
    var skipped = skipStack[skipStack.length - 1]
    match(text)
    .when(/^#(\d\d\d)02:(\S*)$/, function (m) {
      result.channelSentences += 1
      if (!skipped) chart.timeSignatures.set(+m[1], +m[2])
    })
    .when(/^#(?:EXT\s+#)?(\d\d\d)(\S\S):(\S*)$/, function (m) {
      result.channelSentences += 1
      if (!skipped) handleChannelSentence(+m[1], m[2], m[3], lineNumber)
    })
    .when(/^#(\w+)(?:\s+(\S.*))?$/, function (m) {
      result.headerSentences += 1
      if (!skipped) chart.headers.set(m[1], m[2])
    })
    .else(function () {
      warn(lineNumber, 'Invalid command')
    })
  })

  return result

  function handleChannelSentence (measure, channel, string, lineNumber) {
    var items = Math.floor(string.length / 2)
    if (items === 0) return
    for (var i = 0; i < items; i++) {
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

  function warn (lineNumber, message) {
    result.warnings.push({
      lineNumber: lineNumber,
      message: message,
    })
  }

}

function eachLine (text, callback) {
  text.split(/\r\n|\r|\n/)
      .map(function (line) { return line.trim() })
      .forEach(function (line, index) {
    callback(line, index + 1)
  })
}
