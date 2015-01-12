
import readBlob from '../read-blob'
import url      from 'url'

export class BemuseLoader {

  constructor(url) {
    this._url = url
    this._resources = { }
    this._files = { }
  }

  get metadata() {
    return this._metadata ||
          (this._metadata =
              this._resource(this._url).get('metadata'))
  }

  get fileList() {
    return this._fileList ||
          (this._fileList = this.metadata.get('files'))
  }

  file(fileName) {
    return this._files[fileName] ||
          (this._files[fileName] = this._loadFile(fileName))
  }

  _resource(url) {
    return this._resources[url] ||
          (this._resources[url] = this._loadResource(url))
  }

  _loadFile(fileName) {
    return this.fileList
    .then(list => {
      for (let file of list) {
        if (file.name.toLowerCase() === fileName.toLowerCase()) {
          return file
        }
      }
      throw new Error('Unable to find file: ' + fileName)
    })
    .then(file => {
      return Promise.map(file.refs, ref => this._loadRefPart(ref))
      .then(blobs => new Blob(blobs, { type: file.type }))
    })
  }

  _loadRefPart([number, start, end]) {
    return this._ref(number).get('payload')
      .then(x => x.slice(start, end))
  }

  _ref(number) {
    return this.metadata.then(metadata => {
      let info = metadata.refs[number]
      let resolvedUrl =
            info.path ? url.resolve(this._url, info.path) : this._url
      return this._resource(resolvedUrl)
    })
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
