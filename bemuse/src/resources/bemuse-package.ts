import * as ProgressUtils from 'bemuse/progress/utils'
import _ from 'lodash'
import Progress from 'bemuse/progress'
import readBlob from 'bemuse/utils/read-blob'
import throat from 'throat'

import { IResource, IResources } from './types'
import { URLResources } from './url'

type MetadataFileJSON = {
  files: BemusePackFileEntry[]
  refs: BemusePackRefEntry[]
}
type BemusePackRefEntry = { path: string; hash: string }
type BemusePackFileEntry = { name: string; ref: BemusePackContentRef }
type BemusePackContentRef = [number, number, number]

export class BemusePackageResources implements IResources {
  private _base: IResources
  private _fallback: IResources | undefined
  private _fallbackPattern: RegExp | undefined
  private _metadataFilename: string
  public loadPayload: (
    resourcePromise: PromiseLike<IResource>
  ) => PromiseLike<Blob>

  public progress = {
    all: new Progress(),
    current: new Progress(),
  }

  constructor(
    base: string | URL | IResources,
    options: {
      metadataFilename?: string
      fallback?: string | IResources
      fallbackPattern?: RegExp
    } = {}
  ) {
    if (typeof base === 'string') {
      base = new URL(base, location.href)
    }
    if (base instanceof URL) {
      base = new URLResources(base)
    }

    const fallback =
      typeof options.fallback === 'string'
        ? new URLResources(new URL(options.fallback, location.href))
        : options.fallback

    this._base = base
    this._fallback = fallback
    this._fallbackPattern = options.fallbackPattern
    this._metadataFilename = options.metadataFilename || 'metadata.json'

    const simultaneous = ProgressUtils.simultaneous(this.progress.current)
    const nextProgress = () => {
      const progress = new Progress()
      simultaneous.add(progress)
      return progress
    }
    this.loadPayload = ProgressUtils.wrapPromise(
      this.progress.all,
      throat(2, (resourcePromise) =>
        resourcePromise
          .then((resource) => resource.read(nextProgress()))
          .then((arrayBuffer) => new Blob([arrayBuffer]))
          .then(getPayload)
      )
    )
  }

  private _getMetadata = _.once(async () => {
    const file = await this._base.file(this._metadataFilename)
    const data = await file.read()
    const text = await new Blob([data]).text()
    return JSON.parse(text) as MetadataFileJSON
  })

  private _getRefs = _.once(async () => {
    const metadata = await this._getMetadata()
    return metadata.refs.map((spec) => new Ref(this, spec))
  })

  private _getFileMap = _.once(async () => {
    const metadata = await this._getMetadata()
    const files = new Map<string, BemusePackFileEntry>()
    for (const file of metadata.files) {
      files.set(file.name.toLowerCase(), file)
    }
    return files
  })

  get base() {
    return this._base
  }

  async file(name: string): Promise<IResource> {
    const fileMap = await this._getFileMap()
    const file = fileMap.get(name.toLowerCase())
    if (file) {
      return new BemusePackageFileResource(this, file.ref, file.name)
    } else if (
      this._fallback &&
      this._fallbackPattern &&
      this._fallbackPattern.test(name)
    ) {
      return this._fallback.file(name)
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
  private _basePromise: PromiseLike<IResource>
  private _promise: PromiseLike<Blob> | undefined
  constructor(
    private resources: BemusePackageResources,
    spec: BemusePackRefEntry
  ) {
    this._basePromise = resources.base.file(spec.path)
  }

  load() {
    return (
      this._promise ||
      (this._promise = this.resources.loadPayload(this._basePromise))
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
  const array = new Uint8Array(buffer)
  const length =
    array[0] + (array[1] << 8) + (array[2] << 16) + (array[3] << 24)
  const metadataLength = length
  return blob.slice(14 + metadataLength)
}
