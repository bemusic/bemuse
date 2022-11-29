import {
  BGAInfo,
  IndexingInputFile,
  Keys,
  OutputChart,
  OutputFileInfo,
  OutputSongInfo,
  OutputSongInfoVideo,
} from './types'
import {
  BMSChart,
  BMSNote,
  Compiler,
  Notes,
  Reader,
  SongInfo,
  Timing,
} from 'bms'
import {
  hasScratch as bmsonHasScratch,
  keysForBmson,
  musicalScoreForBmson,
  songInfoForBmson,
} from 'bmson'

import _ from 'lodash'
import assign from 'object-assign'
import { createHash } from 'crypto'
import { extname } from 'path'
import { getBmsBga } from './bms-bga'
import { getBmsonBga } from './bmson-bga'
import { getBpmInfo } from './bpm-info'
import { getDuration } from './duration'
import { getKeys } from './keys'
import invariant from 'invariant'
import { lcs } from './lcs'
import pMap from 'p-map'

interface InputMeta {
  name: string
  md5?: string
}

export interface FileIndexBasis {
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
  const str = await Reader.readAsync(source, options)
  const chart = Compiler.compile(str).chart
  const info = SongInfo.fromBMSChart(chart)
  const notes = Notes.fromBMSChart(chart)
  const timing = Timing.fromBMSChart(chart)
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
  const info = songInfoForBmson(object)
  const ms = musicalScoreForBmson(object)
  const notes = ms.notes
  const timing = ms.timing
  const bga = getBmsonBga(object, { timing: timing })
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

  const extensions = options.extensions || _extensions
  const extension =
    extensions[extname(meta.name).toLowerCase()] || extensions['.bms']

  const md5 =
    meta.md5 ||
    (function () {
      const hash = createHash('md5')
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
  const info = basis.info
  const notes = basis.notes
  const timing = basis.timing
  const count = notes.all().filter(noteIsPlayable).length
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
  const warnings: string[] = []
  const cache = options.cache || undefined
  const extra = options.extra || {}
  const report = options.onProgress || function () {}
  const onError =
    options.onError ||
    function (e, name) {
      if (global.console && console.error) {
        console.error('Error while parsing ' + name, e)
      }
    }
  let processed = 0
  const doGetFileInfo = options.getFileInfo || getFileInfo
  const results = await pMap(
    files,
    async function (file): Promise<OutputChart[]> {
      const name = file.name
      const fileData = file.data
      const hash = createHash('md5')
      hash.update(fileData)
      const md5Hash = hash.digest('hex')
      try {
        const cached = await Promise.resolve(cache && cache.get(md5Hash))
        if (cached) {
          return [{ ...cached, file: name }]
        } else {
          const meta = { name: name, md5: md5Hash }
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
  const song: Partial<OutputSongInfo> = {
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
  const result: OutputSongInfoVideo = {}
  const chart = _.find(charts, 'bga')
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
  const objects = chart.objects.all()
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    let channel = +object.channel
    if (channel >= 50 && channel <= 69) channel -= 20
    if (channel === 16 || channel === 26) return true
  }
  return false
}

function common<T>(array: T[], f: (item: T) => string) {
  const longest = array.map(f).reduce(lcs, '')
  return String(longest || f(array[0])).trim()
}

function median<T>(array: T[], f: (item: T) => number) {
  const arr = _(array).map(f).sortBy().value()
  return arr[Math.floor(arr.length / 2)]
}
