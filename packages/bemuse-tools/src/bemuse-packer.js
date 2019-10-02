import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'
import Payload from './payload'

let writeFile = Promise.promisify(fs.writeFile, fs)

export class BemusePacker {
  constructor() {
    this._refs = []
  }
  pack(name, files) {
    let max = 1474560
    let cur = null
    files = files.slice()
    files.sort((a, b) => b.size - a.size)
    for (let file of files) {
      if (cur === null || (cur.size > 0 && cur.size + file.size > max)) {
        cur = this.ref(name)
      }
      cur.add(file)
    }
  }
  ref(name) {
    let ref = new Ref(name, this._refs.length)
    this._refs.push(ref)
    return ref
  }
  async write(folder) {
    let files = []
    let refs = []
    let nums = {}
    for (let ref of this._refs) {
      let payload = new Payload()
      for (let file of ref.files) {
        let [start, end] = payload.add(file.buffer)
        files.push({ name: file.name, ref: [ref.index, start, end] })
      }
      let hash = payload.hash
      let num = (nums[ref.name] || 0) + 1
      nums[ref.name] = num
      let out = ref.name + '.' + num + '.' + hash.substr(0, 8) + '.bemuse'
      refs.push({ path: out, hash: hash })
      await this._writeBin(path.join(folder, out), Buffer.alloc(0), payload)
      console.log(`Written ${out}`)
    }
    let metadata = { files, refs }
    await writeFile(
      path.join(folder, 'metadata.json'),
      JSON.stringify(metadata)
    )
    console.log(`Written metadata.json`)
  }

  _writeBin(path, metadataBuffer, payload) {
    let file = fs.createWriteStream(path)
    let size = Buffer.alloc(4)
    size.writeUInt32LE(metadataBuffer.length, 0)
    file.write(Buffer.from('BEMUSEPACK'))
    file.write(size)
    file.write(metadataBuffer)
    for (let buffer of payload.buffers) {
      file.write(buffer)
    }
    return Promise.promisify(file.end.bind(file))()
  }
}

export class Ref {
  constructor(name, index) {
    this.name = name
    this.index = index
    this.size = 0
    this.files = []
  }
  add(file) {
    this.files.push(file)
    this.size += file.size
  }
}

export default BemusePacker
