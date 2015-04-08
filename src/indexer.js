
import Promise    from 'bluebird'
import co         from 'co'
import fs         from 'fs'
import bms        from 'bms'
import _          from 'lodash'
import chalk      from 'chalk'
import json       from 'format-json'
import lcs        from './lcs'

import { createHash } from 'crypto'
import { join, dirname, basename } from 'path'

let fileStat  = Promise.promisify(fs.stat, fs)
let readFile  = Promise.promisify(fs.readFile, fs)
let writeFile = Promise.promisify(fs.writeFile, fs)
let glob      = Promise.promisify(require('glob'))

export function index(path) {
  return co(function*() {

    let stat = yield fileStat(path)
    if (!stat.isDirectory()) throw new Error('Not a directory: ' + path)

    console.log('-> Scanning files...')
    let dirs = new Map()
    for (var name of yield glob('*/*.{bms,bme,bml}', { cwd: path })) {
      let bmsPath = join(path, name)
      put(dirs, dirname(bmsPath), () => []).push(basename(bmsPath))
    }

    let songs = []
    let maxDirLength = _(Array.from(dirs.keys())).map('length').max()
    for (let [dir, files] of dirs) {
      let charts = [ ]
      for (let file of files) {
        charts.push(yield getChartInfo(dir, file))
      }
      let song = {
        dir:    dir,
        title:  common(charts, x => x.info.title),
        artist: common(charts, x => x.info.artist),
        genre:  common(charts, x => x.info.genre),
        bpm:    median(charts, x => x.bpm.median),
      }
      let levels = _(charts).sortBy(chart => chart.info.level).map(chart => {
        let ch =  chart.keys === '5K' ? chalk.gray :
                  chart.keys === '7K' ? chalk.green :
                  chart.keys === '10K' ? chalk.magenta :
                  chart.keys === '14K' ? chalk.red : chalk.inverse
        return ch(chart.info.level)
      })
      console.log(
        chalk.dim(_.padRight(dir, maxDirLength)),
        chalk.yellow(_.padLeft(Math.round(song.bpm) + 'bpm', 7)),
        chalk.cyan('[' + song.genre + ']'),
        song.artist + '-' + song.title,
        levels.join(' ')
      )
      songs.push(Object.assign({ }, song, { charts }))
    }
    
    writeFile(join(path, 'index.json'), json.diffy(songs))

  })
}


function getChartInfo(dir, file) {
  return co(function*() {
    let buf     = yield readFile(join(dir, file))
    let str     = bms.Reader.read(buf)
    let chart   = bms.Compiler.compile(str).chart
    let info    = bms.SongInfo.fromBMSChart(chart)
    let notes   = bms.Notes.fromBMSChart(chart)
    let timing  = bms.Timing.fromBMSChart(chart)
    let count   = notes.all().filter(note => note.column !== undefined).length
    let bpm     = bpmInfo(notes, timing)
    let hash    = createHash('md5')
    hash.update(buf)
    return {
      file:       file,
      md5:        hash.digest('hex'),
      info:       info,
      noteCount:  count,
      scratch:    hasScratch(chart),
      keys:       detect(chart),
      bpm:        bpm,
    }
  })
}

function bpmInfo(notes, timing) {
  let maxBeat = _(notes.all()).pluck('beat').max()
  let beats   = _(timing.getEventBeats()).concat([0, maxBeat]).sortBy().uniq()
                  .filter(beat => beat <= maxBeat).value()
  let data    = [ ]
  for (let i = 0; i + 1 < beats.length; i ++) {
    let length = timing.beatToSeconds(beats[i + 1]) -
                    timing.beatToSeconds(beats[i])
    let bpm    = timing.bpmAtBeat(beats[i])
    data.push([bpm, length])
  }
  let perc = percentile(data)
  return {
    init: timing.bpmAtBeat(0),
    min:    perc(2),
    median: perc(50),
    max:    perc(98),
  }
}

function percentile(data) {
  data = _.sortBy(data, 0)
  let total = _.sum(data, 1)
  return function(percentileNo) {
    let current = 0
    for (let i = 0; i < data.length; i ++) {
      current += data[i][1]
      if (current / total >= percentileNo / 100) return data[i][0]
    }
  }
}

function hasScratch(chart) {
  let objects = chart.objects.all()
  for (let object of objects) {
    let channel = +object.channel
    if (50 <= channel && channel <= 69) channel -= 20
    if (channel === 16 || channel === 26) return true
  }
  return false
}

function detect(chart) {
  let objects = chart.objects.all()
  let stat = { }
  for (let object of objects) {
    let channel = +object.channel
    if (50 <= channel && channel <= 69) channel -= 20
    if (channel < 10) continue
    if (channel > 29) continue
    stat[channel] = (stat[channel] || 0) + 1
  }
  let channels = Object.keys(stat).map(ch => +ch)
  if (channels.length === 0) return 'empty'
  if (channels.some(ch => 20 <= ch && ch <= 29)) {
    return (stat[18] || stat[19] || stat[28] || stat[29]) ? '14K' : '10K'
  }
  return (stat[18] || stat[19]) ? '7K' : '5K'
}

function put(map, key, f) {
  if (map.has(key)) {
    return map.get(key)
  } else {
    var object = f(key)
    map.set(key, object)
    return object
  }
}

function common(array, f) {
  var longest = array.map(f).reduce(lcs)
  return String(longest || f(array[0])).trim()
}

function median(array, f) {
  var arr = _(array).map(f).sortBy().value()
  return arr[Math.floor(arr.length / 2)]
}


