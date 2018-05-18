import { createHash } from 'crypto'
import { Reader, Compiler, SongInfo, Notes, Timing } from 'bms'
import {
  songInfoForBmson,
  musicalScoreForBmson,
  hasScratch as bmsonHasScratch,
  keysForBmson
} from 'bmson'
import Promise from 'bluebird'
import _ from 'lodash'
import assign from 'object-assign'
import { extname } from 'path'
import invariant from 'invariant'

import { lcs } from './lcs'
import { getKeys } from './keys'
import { getBpmInfo } from './bpm-info'
import { getDuration } from './duration'
import { getBmsonBga } from './bmson-bga'

var readBMS = Promise.promisify(Reader.readAsync, Reader)

const _extensions = {}
export { _extensions as extensions }

_extensions['.bms'] = function (source) {
  return readBMS(source).then(function (str) {
    var chart = Compiler.compile(str).chart
    var info = SongInfo.fromBMSChart(chart)
    var notes = Notes.fromBMSChart(chart)
    var timing = Timing.fromBMSChart(chart)
    return {
      info: info,
      notes: notes,
      timing: timing,
      scratch: hasScratch(chart),
      keys: getKeys(chart)
    }
  })
}

_extensions['.bmson'] = function (source) {
  return Promise.try(function () {
    return new Buffer(source).toString('utf8')
  })
    .then(function (string) {
      return JSON.parse(string)
    })
    .then(function (object) {
      var info = songInfoForBmson(object)
      var ms = musicalScoreForBmson(object)
      var notes = ms.notes
      var timing = ms.timing
      var bga = getBmsonBga(object, { timing: timing })
      return {
        info: info,
        notes: notes,
        timing: timing,
        scratch: bmsonHasScratch(object),
        keys: keysForBmson(object),
        bga: bga
      }
    })
}

function getFileInfo (data, meta, options) {
  options = options || {}
  invariant(typeof meta.name === 'string', 'meta.name must be a string')

  var extensions = options.extensions || _extensions
  var extension =
    extensions[extname(meta.name).toLowerCase()] || extensions['.bms']

  var md5 =
    meta.md5 ||
    (function () {
      var hash = createHash('md5')
      hash.update(data)
      return hash.digest('hex')
    })()

  return extension(data, meta, options).then(function (basis) {
    invariant(basis.info, 'basis.info must be a BMS.SongInfo')
    invariant(basis.notes, 'basis.notes must be a BMS.Notes')
    invariant(basis.timing, 'basis.timing must be a BMS.Timing')
    invariant(
      typeof basis.scratch === 'boolean',
      'basis.scratch must be a boolean'
    )
    invariant(typeof basis.keys === 'string', 'basis.scratch must be a string')

    var info = basis.info
    var notes = basis.notes
    var timing = basis.timing
    var count = notes.all().filter(noteIsPlayable).length

    return {
      md5: md5,
      info: info,
      noteCount: count,
      bpm: getBpmInfo(notes, timing),
      duration: getDuration(notes, timing),
      scratch: basis.scratch,
      keys: basis.keys,
      bga: basis.bga
    }
  })
}

const _getFileInfo = getFileInfo
export { _getFileInfo as getFileInfo }

function getSongInfo (files, options) {
  options = options || {}
  var warnings = []
  var cache = options.cache || undefined
  var extra = options.extra || {}
  var report = options.onProgress || function () {}
  var onError =
    options.onError ||
    function (e, name) {
      if (global.console && console.error) {
        console.error('Error while parsing ' + name, e)
      }
    }
  var processed = 0
  var doGetFileInfo = options.getFileInfo || getFileInfo
  return Promise.map(
    files,
    function (file) {
      var name = file.name
      var data = file.data
      var hash = createHash('md5')
      hash.update(data)
      var md5 = hash.digest('hex')
      return Promise.resolve(cache && cache.get(md5))
        .then(function (cached) {
          if (cached) {
            return cached
          } else {
            var meta = { name: name, md5: md5 }
            return Promise.resolve(doGetFileInfo(data, meta, options)).tap(
              function (info) {
                if (cache) return cache.put(md5, info)
              }
            )
          }
        })
        .then(function (info) {
          info.file = name
          return [info]
        })
        .catch(function (e) {
          onError(e, name)
          warnings.push('Unable to parse ' + name + ': ' + e)
          return []
        })
        .finally(function () {
          processed += 1
          report(processed, files.length, name)
        })
    },
    { concurrency: 2 }
  )
    .then(_.flatten)
    .then(function (charts) {
      if (charts.length === 0) {
        warnings.push('No usable charts found!')
      }
      var song = {
        title: common(charts, _.property('info.title')),
        artist: common(charts, _.property('info.artist')),
        genre: common(charts, _.property('info.genre')),
        bpm: median(charts, _.property('bpm.median'))
      }
      assign(song, getSongVideoFromCharts(charts))
      assign(song, extra)
      song.charts = charts
      song.warnings = warnings
      return song
    })
}

const _getSongInfo = getSongInfo
export { _getSongInfo as getSongInfo }

function getSongVideoFromCharts (charts) {
  var result = {}
  var chart = _.find(charts, 'bga')
  if (chart) {
    result.video_file = chart.bga.file
    result.video_offset = chart.bga.offset
  }
  return result
}

export const _getSongVideoFromCharts = getSongVideoFromCharts

function noteIsPlayable (note) {
  return note.column !== undefined
}

function hasScratch (chart) {
  var objects = chart.objects.all()
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i]
    var channel = +object.channel
    if (channel >= 50 && channel <= 69) channel -= 20
    if (channel === 16 || channel === 26) return true
  }
  return false
}

function common (array, f) {
  var longest = array.map(f).reduce(lcs, [])
  return String(longest || f(array[0])).trim()
}

function median (array, f) {
  var arr = _(array)
    .map(f)
    .sortBy()
    .value()
  return arr[Math.floor(arr.length / 2)]
}
