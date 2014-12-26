
import bytes      from 'bytes'
import gutil      from 'gulp-util'
import fs         from 'fs'

export default class BemusePack {
  constructor(out, options={ }) {
    this.master = !options.slave
    this.metadata = {
      song: { },
      files: [ ],
      dependencies: [ ]
    }
    this.filename = out + '.bemuse'
    this._buffers = [ ]
    this._cursor = 0
  }
  log(...args) {
    gutil.log('[BemusePack ' + this.filename + ']', ...args)
  }
  add(file) {
    if (!(file.contents instanceof Buffer)) {
      throw new gutil.PluginError('BemusePack',
                  'require file.contents to be a buffer')
    }
    let entry = {
      name: file.relative,
      size: file.contents.length,
      offset: this._cursor
    }
    this.metadata.files.push(entry)
    this._buffers.push(file.contents)
    this._cursor += file.contents.length
    this.log(bytes(this._cursor),
      '<<', entry.name, '[' + bytes(entry.size) + ']')
  }
  write() {
    let metadata = new Buffer(JSON.stringify(this.metadata))
    let size = new Buffer(4)
    size.writeUInt32LE(metadata.length, 0)
    let buffers = [
          new Buffer('BEMUSEPACK'),
          size,
          metadata,
          ...this._buffers,
        ]
    return this._writeFile(this.filename, buffers)
  }
  _writeFile(filename, buffers) {
    return new Promise((resolve, reject) => {
      let total = 0
      let stream = fs.createWriteStream(filename)
      for (let buffer of buffers) {
        stream.write(buffer)
        total += buffer.length
      }
      stream.on('finish', () => {
        this.log('written', bytes(total))
        resolve(total)
      })
      stream.on('error', () => {
        reject()
      })
      stream.end()
    })
  }
}

