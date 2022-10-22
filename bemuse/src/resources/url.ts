import Progress from 'bemuse/progress'
import download from 'bemuse/utils/download'
import { basename } from 'path'
import { IResource, IResources } from './types'

export class URLResource implements IResource {
  constructor(private url: string) {}
  read(progress: Progress) {
    return download(this.url).as('arraybuffer', progress)
  }

  async resolveUrl() {
    return Promise.resolve(this.url)
  }

  get name() {
    return basename(this.url)
  }
}

export class URLResources implements IResources {
  constructor(public base: URL) {}
  async file(name: string): Promise<IResource> {
    const path = name
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/')
    return new URLResource(new URL(path, this.base).href)
  }
}

export default URLResource
