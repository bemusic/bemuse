import throat from 'throat'
import axios from 'axios'

import URLResource from './url'

export class IPFSResources {
  constructor (ipfsPath, gateway = IPFSResources.getDefaultGateway()) {
    this._path = ipfsPath
    this._gateway = gateway
  }
  static getDefaultGateway () {
    return 'https://gateway.ipfs.io'
  }
  _throat = throat(5)
  async _loadLinks () {
    const url = `${this._gateway}/api/v0/object/get?arg=${encodeURIComponent(this._path)}`
    const response = await axios.get(url)
    const data = response.data
    if (!data.Links || !data.Links.length) throw new Error('Must be a folder...')
    return data.Links
  }
  _getLinks () {
    return this._linksPromise || (this._linksPromise = this._loadLinks())
  }
  async file (name) {
    const links = await this._getLinks()
    const base = this._path.replace(/^\/|\/$/g, '').split('/')
    for (const l of links) {
      if (l.Name.toLowerCase() === name.toLowerCase()) {
        const pathname = '/' + [ ...base, l.Name ].map(x => encodeURIComponent(x)).join('/')
        return new LimitedConcurrencyResource(
          this._throat,
          new URLResource(`${this._gateway}${pathname}`)
        )
      }
    }
    throw new Error('unable to find ' + name)
  }
  get fileList () {
    return this._getLinks().then(links => links.map(l => l.Name))
  }
}

class LimitedConcurrencyResource {
  constructor (_throat, resource) {
    this._throat = _throat
    this._resource = resource
  }
  read (progress) {
    return this._throat(() => this._resource.read(progress))
  }
  resolveUrl () {
    return this._resource.resolveUrl()
  }
  get name () {
    return this._resource.name
  }
}

export default IPFSResources
