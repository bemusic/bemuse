
import bytes      from 'bytes'
import gutil      from 'gulp-util'
import fs         from 'fs'

export default class BemusePack {
  constructor(out, options={ }) {
    this.master = !options.slave
    this.metadata = { files: [ ], dependencies: [ ] }
    this.filename = out + '.bemuse'
    this._out = out
    this._buffers = [ ]
    this._cursor = 0
    this._dependencies = [ ]
    this._active = { }
    this._types = { }
  }
  log(...args) {
    gutil.log('[BemusePack ' + this.filename + ']', ...args)
  }
  add(file) {
    let splitTarget = this._getSplitTarget(file)
    if (splitTarget) {
      return splitTarget.add(file)
    }
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
    this._types[file.assetType] = true
    this._buffers.push(file.contents)
    this._cursor += file.contents.length
    this.log(bytes(this._cursor),
      '<<', entry.name, '[' + bytes(entry.size) + ']')
  }
  isLarge() {
    return this._cursor >= 1474560
  }
  getTypes() {
    return Object.keys(this._types)
  }
  write() {
    return this._writeDependencies()
    .then(() => {
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
    })
  }
  _writeDependencies() {
    return Promise.all(this._dependencies.map(dependency => {
      return dependency.write().then(size => {
        this.metadata.dependencies.push({
          path: dependency.filename,
          size: size,
          types: dependency.getTypes()
        })
      })
    }))
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
  _getSplitTarget(file) {
    if (!this.master) {
      return false
    }
    let type = file.assetType
    if (type === 'bms') return false
    if (!this._active[type] || this._active[type].isLarge()) {
      let name = this._out + '_' + type + this._dependencies.length
      let pack = new BemusePack(name, { slave: true })
      this._active[type] = pack
      this._dependencies.push(pack)
      return pack
    } else {
      return this._active[type]
    }
  }
}

