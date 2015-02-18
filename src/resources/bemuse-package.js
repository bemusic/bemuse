
import { resolve }      from 'url'
import { basename }     from 'path'
import addLazyProperty  from 'lazy-property'
import R                from 'ramda'
import download         from 'bemuse/download'
import readBlob         from 'bemuse/read-blob'
import Throat           from 'throat'

export class BemusePackageResources {
  constructor(url) {
    let lazy = addLazyProperty.bind(null, this)
    let loadThroat = new Throat(1)
    this._url = url
    this.status = { current: 0, total: 0 }
    lazy('metadata', () =>
      download(resolve(this._url, 'metadata.json')).as('text')
        .then(str => JSON.parse(str)))
    lazy('refs', () =>
      this.metadata.then(
        metadata => metadata.refs.map(spec =>
          new Ref(this, spec, loadThroat))))
    this.getBlob = this.getBlob
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
  notifyStartLoading() {
    this.status.total += 1
    this._notify()
  }
  notifyFinishLoading() {
    this.status.current += 1
    this._notify()
  }
  _notify() {
    if (this.status.total && this.task) {
      let { current, total } = this.status
      this.task.update({ current, total, progress: current / total })
    }
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
  constructor(resources, spec, throat) {
    this._resources = resources
    this._throat = throat
    this._load = () =>
      this._promise || (this._promise =
        this._download(resolve(resources.url, spec.path)))
  }
  load() {
    return this._load()
  }
  _download(url) {
    this._resources.notifyStartLoading()
    return this._throat(() => {
      let task = this._resources.currentPackageTask
      if (task) {
        task.update({
          text: 'Loading ' + basename(url),
          progress: undefined,
          current: undefined,
          total: undefined,
        })
      }
      return download(url).as('blob', task)
        .then(getPayload)
        .tap(() => this._resources.notifyFinishLoading())
    })
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

