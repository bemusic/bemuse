import Promise from 'bluebird'
import co from 'co'
import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'
import json from 'format-json'
import yaml from 'js-yaml'

import { getSongInfo } from 'bemuse-indexer'
import { join, dirname, basename } from 'path'

let fileStat = Promise.promisify(fs.stat, fs)
let readFile = Promise.promisify(fs.readFile, fs)
let writeFile = Promise.promisify(fs.writeFile, fs)
let glob = Promise.promisify(require('glob'))

function Cache (path) {
  let data = load()
  let stream = fs.createWriteStream(path, { encoding: 'utf-8', flags: 'a' })

  function load () {
    let out = {}
    let text
    try {
      text = fs.readFileSync(path, 'utf-8')
    } catch (e) {
      return out
    }
    text.split(/\n/).forEach(function (line) {
      if (line.length < 34) return
      let md5 = line.substr(0, 32)
      let payload = JSON.parse(line.substr(33))
      out[md5] = payload
    })
    return out
  }

  return {
    get: function (key) {
      return data[key]
    },
    put: function (key, value) {
      if (key.length !== 32) throw new Error('Keys should be 32 chars only')
      data[key] = value
      stream.write(key + ' ' + JSON.stringify(value) + '\n')
      return value
    }
  }
}

export function index (path, { recursive }) {
  return co(function * () {
    let stat = yield fileStat(path)
    if (!stat.isDirectory()) throw new Error('Not a directory: ' + path)

    let cache = new Cache(join(path, 'index.cache'))

    console.log('-> Scanning files...')
    let dirs = new Map()
    let pattern = (recursive ? '**/' : '') + '*/*.{bms,bme,bml,bmson}'
    for (var name of yield glob(pattern, { cwd: path })) {
      let bmsPath = join(path, name)
      put(dirs, dirname(bmsPath), () => []).push(basename(bmsPath))
    }

    let songs = []
    let maxDirLength = _(Array.from(dirs.keys()))
      .map('length')
      .max()
    for (let [dir, files] of dirs) {
      let filesToParse = []

      for (let file of files) {
        let buf = yield readFile(join(dir, file))
        if (buf.length > 1048576) {
          console.error(chalk.red('BMS file is too long:'), join(dir, file))
          continue
        }
        filesToParse.push({ name: file, data: buf })
      }

      let extra = yield getExtra(dir)
      let song = yield getSongInfo(filesToParse, { cache, extra })
      song.id = dir
      song.path = dir

      let levels = _(song.charts)
        .sortBy(chart => chart.info.level)
        .map(chart => {
          let ch =
            chart.keys === '5K'
              ? chalk.gray
              : chart.keys === '7K'
                ? chalk.green
                : chart.keys === '10K'
                  ? chalk.magenta
                  : chart.keys === '14K' ? chalk.red : chalk.inverse
          return ch(chart.info.level)
        })
      console.log(
        chalk.dim(_.padEnd(dir, maxDirLength)),
        chalk.yellow(_.padStart(Math.round(song.bpm) + 'bpm', 7)),
        chalk.cyan('[' + song.genre + ']'),
        song.artist + '-' + song.title,
        levels.join(' '),
        song.readme ? '' : chalk.red('[no-meta]')
      )
      songs.push(song)
    }

    let collection = {
      songs: songs
    }

    writeFile(join(path, 'index.json'), json.diffy(collection))
  })
}

function getExtra (dir) {
  return co(function * () {
    let readme
    let extra = {}
    try {
      readme = yield readFile(join(dir, 'README.md'), 'utf-8')
      extra.readme = 'README.md'
    } catch (e) {
      readme = null
    }
    if (readme !== null) {
      try {
        let meta = yaml.safeLoad(readme.substr(0, readme.indexOf('---', 3)))
        extra = Object.assign({}, meta, extra)
      } catch (e) {
        console.error(chalk.red('Unable to read metadata:'), '' + e)
      }
    }
    return extra
  })
}

function put (map, key, f) {
  if (map.has(key)) {
    return map.get(key)
  } else {
    var object = f(key)
    map.set(key, object)
    return object
  }
}
