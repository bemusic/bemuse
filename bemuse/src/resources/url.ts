import download from 'bemuse/utils/download'
import { basename } from 'path'
import { IResource } from './types'
import Progress from 'bemuse/progress'

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

export default URLResource
