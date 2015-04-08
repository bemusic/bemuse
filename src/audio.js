
import Throat     from 'throat'
import { cpus }   from 'os'
import { spawn }  from 'child_process'
import endpoint   from 'endpoint'
import { extname, basename } from 'path'

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
