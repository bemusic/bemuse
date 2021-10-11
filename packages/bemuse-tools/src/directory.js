import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'

let glob = Promise.promisify(require('glob'))
let readFile = Promise.promisify(fs.readFile, fs)

export class Directory {
  constructor(path) {
    this._path = path
  }
  files(pattern) {
    return glob(pattern, { cwd: this._path }).map((name) =>
      readFile(path.join(this._path, name)).then(
        (buffer) => new FileEntry(this, name, buffer)
      )
    )
  }
  get path() {
    return this._path
  }
}

export class FileEntry {
  constructor(directory, filename, buffer) {
    this._directory = directory
    this._filename = filename
    this._buffer = buffer
  }
  derive(name, buffer) {
    return new FileEntry(this._directory, name, buffer)
  }
  get name() {
    return this._filename
  }
  get size() {
    return this._buffer.length
  }
  get buffer() {
    return this._buffer
  }
  get path() {
    return path.join(this._directory.path, this._filename)
  }
}

export default Directory
