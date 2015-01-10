
import readBlob from '../read-blob'

export class BemuseLoader {

  constructor(url) {
    this._url = url
    this._resources = { }
  }

  list() {
    return this._resource(this._url).get('metadata').get('files')
  }

  load() {
  }

  _resource(url) {
    return this._resources[url] ||
          (this._resources[url] = this._loadResource(url))
  }

  _loadResource(url) {
    return new Promise(function(resolve, reject) {
      var xh = new XMLHttpRequest()
      xh.open('GET', url, true)
      xh.responseType = 'blob'
      xh.onload = function() {
        resolve(xh.response)
      }
      xh.onerror = function() {
        reject(new Error('Unable to load ' + url + ': HTTP ' + xh.status))
      }
      xh.send(null)
    }).then(blob => {
      return readBlob(blob.slice(0, 10)).as('text')
        .then(magic => {
          if (magic !== 'BEMUSEPACK') {
            throw new Error('Invalid magic number')
          }
          console.log('srstt')
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
        .then(metadataLength => {
          var payload = blob.slice(14 + metadataLength)
          return this._readMetadata(blob, metadataLength)
            .then(metadata => ({ metadata, payload }))
        })
    })
  }

  _readMetadata(blob, length) {
    if (length === 0) return Promise.resolve(null)
    return readBlob(blob.slice(14, 14 + length)).as('text')
      .then(x => JSON.parse(x))
  }

}

export default BemuseLoader
