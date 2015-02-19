
import { resolve }        from 'url'
import addLazyProperty    from 'lazy-property'
import R                  from 'ramda'
import download           from 'bemuse/download'
import readBlob           from 'bemuse/read-blob'
import throat             from 'throat'
import * as ProgressUtils from 'bemuse/progress/utils'
import Progress           from 'bemuse/progress'

export class BemusePackageResources {
  constructor(url) {
    let lazy = addLazyProperty.bind(null, this)
    this._url = url
    lazy('metadata', () =>
      download(resolve(this._url, 'metadata.json')).as('text')
        .then(str => JSON.parse(str)))
    lazy('refs', () =>
      this.metadata.then(
        metadata => metadata.refs.map(spec => new Ref(this, spec))))
    this.progress = {
      all:      new Progress(),
      current:  new Progress(),
    }
    this._loadPayload = ProgressUtils.wrapPromise(this.progress.all,
      throat(1, (url) => download(url).as('blob', this.progress.current)
        .then(getPayload)))
  }
  get url() {
    return this._url
  }
  file(name) {
    return this.metadata.then(metadata => {
      let file = R.find(file => file.name === name, metadata.files)
      if (!file) throw new Error('Unable to find: ' + name)
      return new BemusePackageFileResource(this, file.ref)
    })
  }
  getBlob(ref) {
    let [index, start, end] = ref
    return this.refs
      .then(refs => refs[index])
      .then(ref => ref.load())
      .then(payload => payload.slice(start, end))
  }
}

class BemusePackageFileResource {
  constructor(resources, ref) {
    this._resources = resources
    this._ref = ref
  }
  read() {
    return this._resources.getBlob(this._ref)
      .then(blob => readBlob(blob).as('arraybuffer'))
  }
}

class Ref {
  constructor(resources, spec) {
    this._resources = resources
    this._url = resolve(resources.url, spec.path)
  }
  load() {
    return this._promise || (this._promise =
      this._resources._loadPayload(this._url))
  }
}

export default BemusePackageResources

function getPayload(blob) {
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

