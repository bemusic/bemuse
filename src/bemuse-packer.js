
import gutil                 from 'gulp-util'
import { basename }          from 'path'
import MIME                  from 'mime'
import { createHash }        from 'crypto'
import { createWriteStream } from 'fs'
import bytes                 from 'bytes'

import Payload      from './payload'

const MAX_PACKAGE_SIZE = 1474560

class Ref {
  constructor(number, path) {
    this.number  = number
    this.payload = new Payload()
    this.number  = number
    this.path    = path
  }
  add(buffer) {
    return this.payload.add(buffer)
  }
  toJSON() {
    let out = {
      size: this.payload.size,
      hash: this.payload.hash,
    }
    if (this.number > 0) {
      out.path = basename(this.path)
    }
    return out
  }
  write(metadataBuffer) {
    let file = createWriteStream(this.path)
    let size = new Buffer(4)
    size.writeUInt32LE(metadataBuffer.length, 0)

    file.write(new Buffer('BEMUSEPACK'))
    file.write(size)
    file.write(metadataBuffer)
    for (let buffer of this.payload.buffers) {
      file.write(buffer)
    }

    return Promise.promisify(file.end.bind(file))()
      .tap(() => gutil.log(`[BemusePack ${this.path}]`,
                    `payload: ${bytes(this.payload.size)}`))
  }
}

export default class BemusePacker {
  constructor(out) {
    this._out    = out
    this._files  = [ ]
    this._refs   = [new Ref(0, out + '.bemuse')]
    this._refMap = { }
  }
  add(file) {
    if (!(file.contents instanceof Buffer)) {
      throw new gutil.PluginError('BemusePack',
                  'require file.contents to be a buffer')
    }
    let entry = {
      name: file.relative,
      type: MIME.lookup(file.path),
      size: file.contents.length,
      hash: createHash('sha1').update(file.contents).digest('hex'),
      refs: this._makeContentRefs(file.contents, file.assetType)
    }
    this._files.push(entry)
    this.log(entry.refs, '<<', entry.name)
  }
  write() {
    let metadata = this._generateMetadata()
    let promises = this._refs.map(ref => {
      if (ref.number === 0) {
        return ref.write(new Buffer(JSON.stringify(metadata)))
      } else {
        return ref.write(new Buffer(0))
      }
    })
    return Promise.all(promises)
  }
  log(...args) {
    gutil.log('[BemusePacker]', ...args)
  }
  _makeContentRefs(buffer, assetType) {
    let ref = this._refMap[assetType]
    if (!ref || ref.size >= MAX_PACKAGE_SIZE) {
      ref = this._refMap[assetType] = this._createRef(assetType)
    }
    return [
      [ref.number, ...ref.add(buffer)]
    ]
  }
  _createRef(type) {
    let path = `${this._out}_${type}${this._refs.length}.bemuse`
    let ref = new Ref(this._refs.length, path)
    this._refs.push(ref)
    return ref
  }
  _generateMetadata() {
    let files = this._files
    let refs  = this._refs.map(ref => ref.toJSON())
    return { version: 2, refs, files }
  }
}

