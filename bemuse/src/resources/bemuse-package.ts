import * as ProgressUtils from 'bemuse/progress/utils'
import _ from 'lodash'
import download from 'bemuse/utils/download'
import readBlob from 'bemuse/utils/read-blob'
import throat from 'throat'
import Progress from 'bemuse/progress'
import { resolve } from 'url'

import { URLResource } from './url'
import { IResources, IResource } from './types'

type MetadataFileJSON = {
  files: BemusePackFileEntry[]
  refs: BemusePackRefEntry[]
}
type BemusePackRefEntry = { path: string; hash: string }
type BemusePackFileEntry = { name: string; ref: BemusePackContentRef }
type BemusePackContentRef = [number, number, number]

export class BemusePackageResources implements IResources {
  private _url: string
  private _fallback: string | undefined
  private _fallbackPattern: RegExp | undefined
  public loadPayload: (payloadUrl: string) => PromiseLike<Blob>

  public progress = {
    all: new Progress(),
    current: new Progress(),
  }

  constructor(
    url: string,
    options: {
      fallback?: string
      fallbackPattern?: RegExp
    } = {}
  ) {
    this._url = url
    this._fallback = options.fallback
    this._fallbackPattern = options.fallbackPattern

    let simultaneous = ProgressUtils.simultaneous(this.progress.current)
    let nextProgress = () => {
      let progress = new Progress()
      simultaneous.add(progress)
      return progress
    }
    this.loadPayload = ProgressUtils.wrapPromise(
      this.progress.all,
      throat(2, (payloadUrl) =>
        download(payloadUrl).as('blob', nextProgress()).then(getPayload)
      )
    )
  }

  private _getMetadata = _.once(async () => {
    const str = await download(resolve(this._url, 'metadata.json')).as('text')
    return JSON.parse(str) as MetadataFileJSON
  })
  private _getRefs = _.once(async () => {
    const metadata = await this._getMetadata()
    return metadata.refs.map((spec) => new Ref(this, spec))
  })
  private _getFileMap = _.once(async () => {
    const metadata = await this._getMetadata()
    let files = new Map<string, BemusePackFileEntry>()
    for (let file of metadata.files) {
      files.set(file.name.toLowerCase(), file)
    }
    return files
  })

  get url() {
    return this._url
  }
  async file(name: string): Promise<IResource> {
    const fileMap = await this._getFileMap()
    let file = fileMap.get(name.toLowerCase())
    if (file) {
      return new BemusePackageFileResource(this, file.ref, file.name)
    } else if (
      this._fallback &&
      this._fallbackPattern &&
      this._fallbackPattern.test(name)
    ) {
      return new URLResource(resolve(this._fallback, name))
    } else {
      throw new Error('Unable to find: ' + name)
    }
  }
  async getBlob([index, start, end]: [number, number, number]) {
    const refs = await this._getRefs()
    const ref = refs[index]
    const payload = await ref.load()
    return payload.slice(start, end)
  }
}

class BemusePackageFileResource implements IResource {
  constructor(
    private resources: BemusePackageResources,
    private ref: BemusePackContentRef,
    public readonly name: string
  ) {}
  read(progress: Progress): PromiseLike<ArrayBuffer> {
    return ProgressUtils.atomic(
      progress,
      this.resources
        .getBlob(this.ref)
        .then((blob) => readBlob(blob).as('arraybuffer'))
    )
  }
  async resolveUrl() {
    const blob = await this.resources.getBlob(this.ref)
    return URL.createObjectURL(blob)
  }
}

class Ref {
  private _url: string
  private _promise: PromiseLike<Blob> | undefined
  constructor(
    private resources: BemusePackageResources,
    spec: BemusePackRefEntry
  ) {
    this._url = resolve(resources.url, spec.path)
  }
  load() {
    return (
      this._promise || (this._promise = this.resources.loadPayload(this._url))
    )
  }
}

export default BemusePackageResources

async function getPayload(blob: Blob) {
  const magic = await readBlob(blob.slice(0, 10)).as('text')
  if (magic !== 'BEMUSEPACK') {
    throw new Error('Invalid magic number')
  }
  const buffer = await readBlob(blob.slice(10, 14)).as('arraybuffer')
  let array = new Uint8Array(buffer)
  let length = array[0] + (array[1] << 8) + (array[2] << 16) + (array[3] << 24)
  const metadataLength = length
  return blob.slice(14 + metadataLength)
}
