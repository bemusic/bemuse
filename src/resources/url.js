
import download from 'bemuse/download'
import { basename } from 'path'

export class URLResource {
  constructor(url) {
    this._url = url
  }
  read(progress) {
    return download(this._url).as('arraybuffer', progress)
  }
  get name() {
    return basename(this._url)
  }
}

export default URLResource
