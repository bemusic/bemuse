
import Promise    from 'bluebird'
import express    from 'express'
import cors       from 'cors'
import fs         from 'fs'
import * as path  from 'path'
import Rx         from 'rx'
import bytes      from 'bytes'

let glob = Promise.promisify(require('glob'))
let stat = Promise.promisify(fs.stat)

export function start(dir, port) {
  port = +port || 3456
  return new Promise(function() {
    const app = express()
    app.use(cors())
    app.use(express.static(dir))
    app.use(bemuseAssets(dir))
    app.listen(port, () => {
      console.log('Listening at port', port)
    })
  })
}

function bemuseAssets(dir) {
  let serveSongAssets = createAssetServer()
  dir = path.normalize(fs.realpathSync(dir))
  return function(req, res, next) {
    let match = req.path.match(/^\/+(.+)\/assets\/([^\/]+)$/)
    if (!match) return next()
    let song = decodeURIComponent(match[1])
    let file = match[2]
    let target = path.normalize(path.join(dir, song))
    if (target.substr(0, dir.length) !== dir) return next()
    serveSongAssets(target, file, res, next)
  }
}

function createAssetServer() {
  var songCache = { }
  return function(target, file, res, next) {
    void (songCache[target] || (songCache[target] = createSongServer(target)))(file, res, next)
  }
}

function createSongServer(dir) {
  let promise = glob('**/*.{wav,ogg,mp3,m4a}', { cwd: dir })
  .map(name => stat(path.join(dir, name))
      .then(stats => ({ name: name, size: stats.size })))
  .then(files => {
    let ref = { path: 'data.bemuse' }
    let metadata = { files: [], refs: [ref] }
    let current = 0
    for (let file of files) {
      let left = current
      let right = left + file.size
      let entry = { name: file.name, ref: [0, left, right] }
      metadata.files.push(entry)
      current = right
    }
    console.log('Serving ' + dir + ' (' + files.length + ' files, ' + bytes(current) + ')')
    return { metadata, files }
  })
  return function(file, res, next) {
    promise.then(function({ metadata, files }) {
      if (file === 'metadata.json') {
        res.json(metadata)
      } else if (file === 'data.bemuse') {
        streamFiles(dir, files, res)
      } else {
        throw new Error('Invalid file!')
      }
    }).catch(e => next(e))
  }
}

function streamFiles(dir, files, res) {
  let stream = Rx.Observable.concat([
    Rx.Observable.just(new Buffer('BEMUSEPACK')),
    Rx.Observable.just(new Buffer([0, 0, 0, 0])),
    Rx.Observable.concat(files.map(file => streamFile(dir, file))),
  ])
  stream.subscribe(
    buffer => res.write(buffer),
    err => console.error(err),
    () => res.end()
  )
}

function streamFile(dir, file) {
  return Rx.Observable.create(function(observer) {
    let stream = fs.createReadStream(path.join(dir, file.name))
    stream.on('data', b => observer.onNext(b))
    stream.on('end', () => observer.onCompleted())
    stream.on('error', e => observer.onError(e))
    return function() {
    }
  })
}
