
var createHash  = require('crypto').createHash
var bms         = require('bms')
var Promise     = require('bluebird')
var _           = require('lodash')
var lcs         = require('./lcs')
var assign      = require('object-assign')

var readBMS     = Promise.promisify(bms.Reader.readAsync, bms.Reader)

function getChartInfo(source) {
  return readBMS(source).then(function(str) {
    var chart   = bms.Compiler.compile(str).chart
    var info    = bms.SongInfo.fromBMSChart(chart)
    var notes   = bms.Notes.fromBMSChart(chart)
    var timing  = bms.Timing.fromBMSChart(chart)
    var count   = notes.all().filter(noteIsPlayable).length
    var bpm     = bpmInfo(notes, timing)
    var hash    = createHash('md5')
    hash.update(source)
    return {
      md5:        hash.digest('hex'),
      info:       info,
      noteCount:  count,
      scratch:    hasScratch(chart),
      keys:       detect(chart),
      bpm:        bpm,
    }
  })
}

exports.getChartInfo = getChartInfo

function getSongInfo(files, options) {
  var warnings = []
  var cache = (options && options.cache) || undefined
  var extra = (options && options.extra) || { }
  var report = (options && options.onProgress) || function() { }
  var processed = 0
  return Promise.map(files, function(file) {
    var name = file.name
    var data = file.data
    var hash = createHash('md5')
    hash.update(data)
    var md5 = hash.digest('hex')
    return Promise.resolve(cache && cache.get(md5))
    .then(function(cached) {
      if (cached) {
        return cached
      } else {
        return Promise.resolve(getChartInfo(data)).tap(function(info) {
          if (cache) return cache.put(md5, info)
        })
      }
    })
    .then(function(info) {
      info.file = name
      return [info]
    })
    .catch(function(e) {
      warnings.push('Unable to parse ' + name + ': ' + e)
      return []
    })
    .finally(function() {
      processed += 1
      report(processed, files.length, name)
    })
  })
  .then(_.flatten)
  .then(function(charts) {
    if (charts.length === 0) {
      warnings.push('No usable charts found!')
    }
    var song = {
      title:  common(charts, _.property('info.title')),
      artist: common(charts, _.property('info.artist')),
      genre:  common(charts, _.property('info.genre')),
      bpm:    median(charts, _.property('bpm.median')),
    }
    assign(song, extra)
    song.charts   = charts
    song.warnings = warnings
    return song
  })
}

exports.getSongInfo = getSongInfo

function noteIsPlayable(note) {
  return note.column !== undefined
}

function bpmInfo(notes, timing) {
  var maxBeat = _(notes.all()).pluck('beat').max()
  var beats   = _(timing.getEventBeats())
                  .concat([0, maxBeat])
                  .sortBy()
                  .uniq()
                  .filter(function(beat) { return beat <= maxBeat })
                  .value()
  var data    = [ ]
  for (var i = 0; i + 1 < beats.length; i ++) {
    var length = timing.beatToSeconds(beats[i + 1]) -
                    timing.beatToSeconds(beats[i])
    var bpm    = timing.bpmAtBeat(beats[i])
    data.push([bpm, length])
  }
  var perc = percentile(data)
  return {
    init:   timing.bpmAtBeat(0),
    min:    perc(2),
    median: perc(50),
    max:    perc(98),
  }
}

function percentile(data) {
  data = _.sortBy(data, 0)
  var total = _.sum(data, 1)
  return function(percentileNo) {
    var current = 0
    for (var i = 0; i < data.length; i ++) {
      current += data[i][1]
      if (current / total >= percentileNo / 100) return data[i][0]
    }
  }
}

function hasScratch(chart) {
  var objects = chart.objects.all()
  for (var object of objects) {
    var channel = +object.channel
    if (50 <= channel && channel <= 69) channel -= 20
    if (channel === 16 || channel === 26) return true
  }
  return false
}

function detect(chart) {
  var objects = chart.objects.all()
  var stat = { }
  for (var object of objects) {
    var channel = +object.channel
    if (50 <= channel && channel <= 69) channel -= 40
    if (channel < 10) continue
    if (channel > 29) continue
    stat[channel] = (stat[channel] || 0) + 1
  }
  var channels = Object.keys(stat).map(function(ch) { return +ch })
  if (channels.length === 0) return 'empty'
  if (channels.some(isSecondPlayer)) {
    return (stat[18] || stat[19] || stat[28] || stat[29]) ? '14K' : '10K'
  }
  return (stat[18] || stat[19]) ? '7K' : '5K'

  function isSecondPlayer(ch) {
    return 20 <= ch && ch <= 29
  }
}

function common(array, f) {
  var longest = array.map(f).reduce(lcs, [])
  return String(longest || f(array[0])).trim()
}

function median(array, f) {
  var arr = _(array).map(f).sortBy().value()
  return arr[Math.floor(arr.length / 2)]
}
