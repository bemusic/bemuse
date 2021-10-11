// Public: A module that takes a string representing the BMS notechart,
// parses it, and compiles into a {BMSChart}.
/* module */
import { match } from '../util/match'
import { BMSChart } from '../bms/chart'
import { BMSObject } from '../bms/objects'

var matchers = {
  bms: {
    random: /^#RANDOM\s+(\d+)$/i,
    if: /^#IF\s+(\d+)$/i,
    endif: /^#ENDIF$/i,
    timeSignature: /^#(\d\d\d)02:(\S*)$/,
    channel: /^#(?:EXT\s+#)?(\d\d\d)(\S\S):(\S*)$/,
    header: /^#(\w+)(?:\s+(\S.*))?$/,
  },
  dtx: {
    random: /^#RANDOM\s+(\d+)$/i,
    if: /^#IF\s+(\d+)$/i,
    endif: /^#ENDIF$/i,
    timeSignature: /^#(\d\d\d)02:\s*(\S*)$/,
    channel: /^#(?:EXT\s+#)?(\d\d\d)(\S\S):\s*(\S*)$/,
    header: /^#(\w+):(?:\s+(\S.*))?$/,
  },
}

/**
 * Reads the string representing the BMS notechart, parses it,
 * and compiles into a {BMSChart}.
 * @param text the BMS notechart
 * @param options additional parser options
 */
export function compile(text: string, options?: Partial<BMSCompileOptions>) {
  options = options || {}

  var chart = new BMSChart()

  var rng =
    options.rng ||
    function (max) {
      return 1 + Math.floor(Math.random() * max)
    }

  var matcher = (options.format && matchers[options.format]) || matchers.bms

  var randomStack: number[] = []
  var skipStack = [false]

  var result = {
    headerSentences: 0,
    channelSentences: 0,
    controlSentences: 0,
    skippedSentences: 0,
    malformedSentences: 0,

    /**
     * The resulting chart
     */
    chart: chart,

    /**
     * Warnings found during compilation
     */
    warnings: [] as { lineNumber: number; message: string }[],
  }

  eachLine(text, function (text, lineNumber) {
    var flow = true
    if (text.charAt(0) !== '#') return
    match(text)
      .when(matcher.random, function (m) {
        result.controlSentences += 1
        randomStack.push(rng(+m[1]))
      })
      .when(matcher.if, function (m) {
        result.controlSentences += 1
        skipStack.push(randomStack[randomStack.length - 1] !== +m[1])
      })
      .when(matcher.endif, function (m) {
        result.controlSentences += 1
        skipStack.pop()
      })
      .else(function () {
        flow = false
      })
    if (flow) return
    var skipped = skipStack[skipStack.length - 1]
    match(text)
      .when(matcher.timeSignature, function (m) {
        result.channelSentences += 1
        if (!skipped) chart.timeSignatures.set(+m[1], +m[2])
      })
      .when(matcher.channel, function (m) {
        result.channelSentences += 1
        if (!skipped) handleChannelSentence(+m[1], m[2], m[3], lineNumber)
      })
      .when(matcher.header, function (m) {
        result.headerSentences += 1
        if (!skipped) chart.headers.set(m[1], m[2])
      })
      .else(function () {
        warn(lineNumber, 'Invalid command')
      })
  })

  return result

  function handleChannelSentence(
    measure: number,
    channel: string,
    string: string,
    lineNumber: number
  ) {
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
      } as BMSObject)
    }
  }

  function warn(lineNumber: number, message: string) {
    result.warnings.push({
      lineNumber: lineNumber,
      message: message,
    })
  }
}

function eachLine(
  text: string,
  callback: (line: string, index: number) => void
) {
  text
    .split(/\r\n|\r|\n/)
    .map(function (line) {
      return line.trim()
    })
    .forEach(function (line, index) {
      callback(line, index + 1)
    })
}

export interface BMSCompileOptions {
  /** File format */
  format: 'bms' | 'dtx'

  /** A function that generates a random number.
   *  It is used when processing `#RANDOM n` directive.
   *  This function should return an integer number between 1 and `n`.
   */
  rng: (max: number) => number
}
