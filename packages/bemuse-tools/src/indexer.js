import Promise from 'bluebird'
import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'
import json from 'format-json'
import yaml from 'js-yaml'

import { getSongInfo } from 'bemuse-indexer'
import { join, dirname, basename } from 'path'

const fileStat = Promise.promisify(fs.stat, fs)
const readFile = Promise.promisify(fs.readFile, fs)
const writeFile = Promise.promisify(fs.writeFile, fs)
const glob = Promise.promisify(require('glob'))

function Cache(path) {
  const data = load()
  const stream = fs.createWriteStream(path, { encoding: 'utf-8', flags: 'a' })

  function load() {
    const out = {}
    let text
    try {
      text = fs.readFileSync(path, 'utf-8')
    } catch (e) {
      return out
    }
    text.split(/\n/).forEach(function (line) {
      if (line.length < 34) return
      const md5 = line.substr(0, 32)
      const payload = JSON.parse(line.substr(33))
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
    },
  }
}

export async function index(path, { recursive }) {
  const stat = await fileStat(path)
  if (!stat.isDirectory()) throw new Error('Not a directory: ' + path)

  const cache = new Cache(join(path, 'index.cache'))

  console.log('-> Scanning files...')
  const dirs = new Map()
  const pattern = (recursive ? '**/' : '') + '*/*.{bms,bme,bml,bmson}'
  for (const name of await glob(pattern, { cwd: path })) {
    const bmsPath = join(path, name)
    put(dirs, dirname(bmsPath), () => []).push(basename(bmsPath))
  }

  const songs = []
  const maxDirLength = _(Array.from(dirs.keys())).map('length').max()
  for (const [dir, files] of dirs) {
    const filesToParse = []

    for (const file of files) {
      const buf = await readFile(join(dir, file))
      if (buf.length > 1048576) {
        console.error(chalk.red('BMS file is too long:'), join(dir, file))
        continue
      }
      filesToParse.push({ name: file, data: buf })
    }

    const extra = await getExtra(dir)
    const song = await getSongInfo(filesToParse, { cache, extra })
    song.id = dir
    song.path = dir

    const levels = _(song.charts)
      .sortBy((chart) => chart.info.level)
      .map((chart) => {
        const ch =
          chart.keys === '5K'
            ? chalk.gray
            : chart.keys === '7K'
            ? chalk.green
            : chart.keys === '10K'
            ? chalk.magenta
            : chart.keys === '14K'
            ? chalk.red
            : chalk.inverse
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

  const collection = {
    songs: songs,
  }

  await writeFile(join(path, 'index.json'), json.diffy(collection))
}

async function getExtra(dir) {
  let readme
  let extra = {}
  try {
    readme = await readFile(join(dir, 'README.md'), 'utf-8')
    extra.readme = 'README.md'
  } catch (e) {
    readme = null
  }
  if (readme !== null) {
    try {
      const meta = yaml.safeLoad(readme.substr(0, readme.indexOf('---', 3)))
      extra = Object.assign({}, meta, extra)
    } catch (e) {
      console.error(chalk.red('Unable to read metadata:'), '' + e)
    }
  }
  return extra
}

function put(map, key, f) {
  if (map.has(key)) {
    return map.get(key)
  } else {
    const object = f(key)
    map.set(key, object)
    return object
  }
}
