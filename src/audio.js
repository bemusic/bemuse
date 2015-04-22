
import Promise    from 'bluebird'
import co         from 'co'
import fs         from 'fs'
import Throat     from 'throat'
import { cpus }   from 'os'
import endpoint   from 'endpoint'
import { spawn, execFile as _execFile } from 'child_process'
import { extname, basename } from 'path'

import tmp        from './temporary'

let readFile  = Promise.promisify(fs.readFile, fs)
let writeFile = Promise.promisify(fs.writeFile, fs)
let execFile  = Promise.promisify(_execFile)

let throat = new Throat(cpus().length || 1)

export class AudioConvertor {
  constructor(type, ...extra) {
    this._target = type
    this._extra = extra
  }
  convert(file) {
    let ext = extname(file.name).toLowerCase()
    if (ext === '.' + this._target && !this.force) {
      return Promise.resolve(file)
    } else {
      let name = basename(file.name, ext) + '.' + this._target
      return this._doConvert(file.path, this._target)
        .then(buffer => file.derive(name, buffer))
    }
  }
  _doConvert(path, type) {
    if (type === 'm4a') {
      return co(function*() {
        let wav = yield this._doSoX(path, 'wav')
        let prefix = tmp()
        let wavPath = prefix + '.wav'
        let m4aPath = prefix + '.m4a'
        yield writeFile(wavPath, wav)
        yield execFile('afconvert', [wavPath, m4aPath, '-f', 'm4af',
                '-b', '128000', '-q', '127', '-s', '2'])
        return yield readFile(m4aPath)
      }.bind(this))
    } else {
      return this._doSoX(path, type)
    }
  }
  _doSoX(path, type) {
    return throat(() => new Promise((resolve, reject) => {
      let sox = spawn('sox', [path, '-t', type, ...this._extra, '-'])
      sox.stdin.end()
      sox.stderr.on('data', x => process.stderr.write(x))
      let data = new Promise((resolve, reject) => {
        sox.stdout.pipe(endpoint((err, buffer) => {
          if (err) {
            console.error('Error reading audio!')
            reject(err)
          } else {
            resolve(buffer)
          }
        }))
      })
      sox.on('close', (code) => {
        if (code === 0) {
          resolve(data)
        } else {
          console.error('Unable to convert audio file -- SoX exited ' + code)
          reject(new Error('SoX process exited: ' + code))
        }
      })
    }))
  }
}

export default AudioConvertor
