
import gutil          from 'gulp-util'
import { basename }   from 'path'
import MIME           from 'mime'
import { createHash } from 'crypto'

import Payload      from './payload'

const MAX_PACKAGE_SIZE = 1474560

class Ref {
  constructor(number, path) {
    this.payload = new Payload()
    this.number  = number
    if (path) {
      this.path  = path
    }
  }
  add(buffer) {
    return this.payload.add(buffer)
  }
  toJSON() {
    let out = {
      size: this.payload.size,
      hash: this.payload.hash,
    }
    if (this.path) {
      out.path = basename(this.path)
    }
    return out
  }
}

export default class BemusePacker {
  constructor(out) {
    this._out    = out
    this._files  = [ ]
    this._refs   = [new Ref(0, null)]
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
    return new Promise((resolve, reject) => {
      console.log(this._generateMetadata())
      resolve()
      void reject
    })
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

