import * as ProgressUtils from 'bemuse/progress/utils'

import addLazyProperty from 'lazy-property'
import download from 'bemuse/utils/download'
import readBlob from 'bemuse/utils/read-blob'
import throat from 'throat'
import Progress from 'bemuse/progress'
import { resolve } from 'url'

import { URLResource } from './url'

export class BemusePackageResources {
  constructor (url, options = { }) {
    let lazy = addLazyProperty.bind(null, this)
    this._url = url
    this._fallback = options.fallback
    this._fallbackPattern = options.fallbackPattern
    lazy('metadata', () =>
      download(resolve(this._url, 'metadata.json')).as('text')
        .then(str => JSON.parse(str)))
    lazy('refs', () =>
      this.metadata.then(metadata =>
        metadata.refs.map(spec => new Ref(this, spec))))
    lazy('_fileMap', () =>
      this.metadata.then(metadata => {
        let files = new Map()
        for (let file of metadata.files) {
          files.set(file.name.toLowerCase(), file)
        }
        return files
      }))
    this.progress = {
      all: new Progress(),
      current: new Progress()
    }
    let simultaneous = ProgressUtils.simultaneous(this.progress.current)
    let nextProgress = () => {
      let progress = new Progress()
      simultaneous.add(progress)
      return progress
    }
    this._loadPayload = ProgressUtils.wrapPromise(this.progress.all,
      throat(2, (payloadUrl) =>
        download(payloadUrl).as('blob', nextProgress()).then(getPayload)
      )
    )
  }
  get url () {
    return this._url
  }
  file (name) {
    return this._fileMap.then(fileMap => {
      let file = fileMap.get(name.toLowerCase())
      if (file) {
        return new BemusePackageFileResource(this, file.ref, file.name)
      } else if (this._fallback && this._fallbackPattern.test(name)) {
        return new URLResource(resolve(this._fallback, name))
      } else {
        throw new Error('Unable to find: ' + name)
      }
    })
  }
  getBlob ([index, start, end]) {
    return this.refs
      .then(refs => refs[index])
      .then(ref => ref.load())
      .then(payload => payload.slice(start, end))
  }
}

class BemusePackageFileResource {
  constructor (resources, ref, name) {
    this._resources = resources
    this._ref = ref
    this._name = name
  }
  read (progress) {
    return ProgressUtils.atomic(progress,
      this._resources.getBlob(this._ref)
        .then(blob => readBlob(blob).as('arraybuffer')))
  }
  resolveUrl () {
    return this._resources.getBlob(this._ref).then(blob => (
      URL.createObjectURL(blob)
    ))
  }
  get name () {
    return this._name
  }
}

class Ref {
  constructor (resources, spec) {
    this._resources = resources
    this._url = resolve(resources.url, spec.path)
  }
  load () {
    return this._promise || (this._promise =
      this._resources._loadPayload(this._url))
  }
}

export default BemusePackageResources

function getPayload (blob) {
  return readBlob(blob.slice(0, 10)).as('text')
    .then(magic => {
      if (magic !== 'BEMUSEPACK') {
        throw new Error('Invalid magic number')
      }
      return readBlob(blob.slice(10, 14)).as('arraybuffer')
    })
    .then(buffer => {
      let array = new Uint8Array(buffer)
      let length = array[0] +
                  (array[1] << 8) +
                  (array[2] << 16) +
                  (array[3] << 24)
      return length
    })
    .then(metadataLength => blob.slice(14 + metadataLength))
}
