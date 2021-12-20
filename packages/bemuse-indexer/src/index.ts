import { createHash } from 'crypto'
import {
  Reader,
  Compiler,
  SongInfo,
  Notes,
  Timing,
  ReaderOptions,
  BMSChart,
  BMSNote,
} from 'bms'
import {
  songInfoForBmson,
  musicalScoreForBmson,
  hasScratch as bmsonHasScratch,
  keysForBmson,
} from 'bmson'
import Bluebird from 'bluebird'
import _ from 'lodash'
import assign from 'object-assign'
import { extname } from 'path'
import invariant from 'invariant'

import { lcs } from './lcs'
import { getKeys } from './keys'
import { getBpmInfo } from './bpm-info'
import { getDuration } from './duration'
import { getBmsonBga } from './bmson-bga'
import {
  BGAInfo,
  Keys,
  IndexingInputFile,
  OutputFileInfo,
  OutputSongInfoVideo,
  OutputSongInfo,
  OutputChart,
} from './types'
import { getBmsBga } from './bms-bga'

var readBMS = Bluebird.promisify<string, Buffer, ReaderOptions | null>(
  Reader.readAsync
)

interface InputMeta {
  name: string
  md5?: string
}

interface FileIndexBasis {
  info: SongInfo
  notes: Notes
  timing: Timing
  scratch: boolean
  keys: Keys
  bga?: BGAInfo
}

interface ExtensionHandler {
  (source: Buffer, meta: InputMeta): Promise<FileIndexBasis>
}
interface ExtensionMap {
  [extname: string]: ExtensionHandler
}
const _extensions: ExtensionMap = {}
export { _extensions as extensions }

_extensions['.bms'] = async function (source, meta) {
  const options = Reader.getReaderOptionsFromFilename(meta.name)
  const str = await readBMS(source, options)
  var chart = Compiler.compile(str).chart
  var info = SongInfo.fromBMSChart(chart)
  var notes = Notes.fromBMSChart(chart)
  var timing = Timing.fromBMSChart(chart)
  return {
    info: info,
    notes: notes,
    timing: timing,
    scratch: hasScratch(chart),
    keys: getKeys(chart),
    bga: getBmsBga(chart, { timing }),
  }
}

_extensions['.bmson'] = async function (source) {
  const string = Buffer.from(source).toString('utf8')
  const object = JSON.parse(string)
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
    bga: bga,
  }
}

async function getFileInfo(
  data: Buffer,
  meta: InputMeta,
  options?: { extensions?: ExtensionMap }
): Promise<OutputFileInfo> {
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

  const basis = await extension(data, meta)
  invariant(basis.info, 'basis.info must be a BMS.SongInfo')
  invariant(basis.notes, 'basis.notes must be a BMS.Notes')
  invariant(basis.timing, 'basis.timing must be a BMS.Timing')
  invariant(
    typeof basis.scratch === 'boolean',
    'basis.scratch must be a boolean'
  )
  invariant(typeof basis.keys === 'string', 'basis.keys must be a string')
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
    bga: basis.bga,
  }
}

const _getFileInfo = getFileInfo
export { _getFileInfo as getFileInfo }

async function getSongInfo(
  files: IndexingInputFile[],
  options?: {
    cache?: {
      get(md5: string): OutputFileInfo
      put(md5: string, info: OutputFileInfo): void
    }
    extra?: any
    onProgress?: any
    onError?: (error: Error, name: string) => void
    getFileInfo?: typeof getFileInfo
  }
): Promise<OutputSongInfo> {
  options = options || {}
  var warnings: string[] = []
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
  const results: OutputChart[][] = await Bluebird.map(
    files,
    async function (file): Promise<OutputChart[]> {
      var name = file.name
      var fileData = file.data
      var hash = createHash('md5')
      hash.update(fileData)
      var md5Hash = hash.digest('hex')
      try {
        const cached = await Promise.resolve(cache && cache.get(md5Hash))
        if (cached) {
          return [{ ...cached, file: name }]
        } else {
          var meta = { name: name, md5: md5Hash }
          const info = await Promise.resolve(doGetFileInfo(fileData, meta))
          if (cache) cache.put(md5Hash, info)
          return [{ ...info, file: name }]
        }
      } catch (e) {
        onError(e as Error, name)
        warnings.push('Unable to parse ' + name + ': ' + e)
        return []
      } finally {
        processed += 1
        report(processed, files.length, name)
      }
    },
    { concurrency: 2 }
  )
  const charts = _.flatten(results)
  if (charts.length === 0) {
    warnings.push('No usable charts found!')
  }
  var song: Partial<OutputSongInfo> = {
    title: common(charts, _.property('info.title')),
    artist: common(charts, _.property('info.artist')),
    genre: common(charts, _.property('info.genre')),
    bpm: median(charts, _.property('bpm.median')),
  }
  assign(song, getSongVideoFromCharts(charts))
  assign(song, extra)
  song.charts = charts
  song.warnings = warnings
  return song as OutputSongInfo
}

const _getSongInfo = getSongInfo
export { _getSongInfo as getSongInfo }

function getSongVideoFromCharts(charts: OutputFileInfo[]): OutputSongInfoVideo {
  var result: OutputSongInfoVideo = {}
  var chart = _.find(charts, 'bga')
  if (chart) {
    result.video_file = chart.bga!.file
    result.video_offset = chart.bga!.offset
  }
  return result
}

export const _getSongVideoFromCharts = getSongVideoFromCharts

function noteIsPlayable(note: BMSNote) {
  return note.column !== undefined
}

function hasScratch(chart: BMSChart) {
  var objects = chart.objects.all()
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i]
    var channel = +object.channel
    if (channel >= 50 && channel <= 69) channel -= 20
    if (channel === 16 || channel === 26) return true
  }
  return false
}

function common<T>(array: T[], f: (item: T) => string) {
  var longest = array.map(f).reduce(lcs, '')
  return String(longest || f(array[0])).trim()
}

function median<T>(array: T[], f: (item: T) => number) {
  var arr = _(array).map(f).sortBy().value()
  return arr[Math.floor(arr.length / 2)]
}
