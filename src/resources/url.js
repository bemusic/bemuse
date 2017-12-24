import download from 'bemuse/utils/download'
import { basename } from 'path'

export class URLResource {
  constructor (url) {
    this._url = url
  }
  read (progress) {
    return download(this._url).as('arraybuffer', progress)
  }
  resolveUrl () {
    return Promise.resolve(this._url)
  }
  get name () {
    return basename(this._url)
  }
}

export default URLResource
