
import download from 'bemuse/download'
import { basename } from 'path'

export class URLResource {
  constructor(url) {
    this._url = url
  }
  read(task) {
    return download(this._url).as('arraybuffer', task)
  }
  get name() {
    return basename(this._url)
  }
}

export default URLResource
