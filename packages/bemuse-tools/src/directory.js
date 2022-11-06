import fs from 'fs'
import glob from 'glob-promise'
import path from 'path'

const { readFile } = fs.promises

export class Directory {
  constructor(path) {
    this._path = path
  }

  async files(pattern) {
    const names = await glob(pattern, { cwd: this._path })
    return await Promise.all(
      names.map(async (name) => {
        const buffer = await readFile(path.join(this._path, name))
        return new FileEntry(this, name, buffer)
      })
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
