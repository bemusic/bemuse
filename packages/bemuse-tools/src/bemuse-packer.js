import Payload from './payload'
import fs from 'fs'
import path from 'path'

const { writeFile } = fs.promises

export class BemusePacker {
  constructor() {
    this._refs = []
  }

  pack(name, files) {
    const max = 1474560
    let cur = null
    files = files.slice()
    files.sort((a, b) => b.size - a.size)
    for (const file of files) {
      if (cur === null || (cur.size > 0 && cur.size + file.size > max)) {
        cur = this.ref(name)
      }
      cur.add(file)
    }
  }

  ref(name) {
    const ref = new Ref(name, this._refs.length)
    this._refs.push(ref)
    return ref
  }

  async write(folder) {
    const files = []
    const refs = []
    const nums = {}
    for (const ref of this._refs) {
      const payload = new Payload()
      for (const file of ref.files) {
        const [start, end] = payload.add(file.buffer)
        files.push({ name: file.name, ref: [ref.index, start, end] })
      }
      const hash = payload.hash
      const num = (nums[ref.name] || 0) + 1
      nums[ref.name] = num
      const out = ref.name + '.' + num + '.' + hash.substr(0, 8) + '.bemuse'
      refs.push({ path: out, hash: hash })
      await this._writeBin(path.join(folder, out), Buffer.alloc(0), payload)
      console.log(`Written ${out}`)
    }
    const metadata = { files, refs }
    await writeFile(
      path.join(folder, 'metadata.json'),
      JSON.stringify(metadata)
    )
    console.log(`Written metadata.json`)
  }

  _writeBin(path, metadataBuffer, payload) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(path)
      const size = Buffer.alloc(4)
      size.writeUInt32LE(metadataBuffer.length, 0)
      file.write(Buffer.from('BEMUSEPACK'))
      file.write(size)
      file.write(metadataBuffer)
      for (const buffer of payload.buffers) {
        file.write(buffer)
      }
      file.once('finish', () => resolve())
      file.once('error', reject)
      file.end()
    })
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
