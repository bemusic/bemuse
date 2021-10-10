import * as ProgressUtils from 'bemuse/progress/utils'
import throat from 'throat'
import axios from 'axios'
import query from 'bemuse/utils/query'

import URLResource from './url'

export function getIPFSResources(ipfsPath, gateway) {
  if (window.ipfs && query.BEMUSE_USE_IPFS_COMPANION === '1') {
    return new NativeIPFSResources(ipfsPath)
  } else {
    return new GatewayIPFSResources(ipfsPath, gateway)
  }
}

class NativeIPFSResources {
  constructor(ipfsPath) {
    this._path = ipfsPath
  }
  get gatewayName() {
    return `IPFS Companion extension`
  }
  _throat = throat(8)
  async _loadLinks() {
    const m = this._path.match(/^\/ipfs\/([^/]+)\/?$/)
    if (!m) throw new Error('Only IPFS path is supported')
    const multihash = m[1]
    const response = await window.ipfs.object.get(multihash)
    const data = response.toJSON()
    if (!data.links || !data.links.length) {
      throw new Error('Must be a folder...')
    }
    return data.links
  }
  _getLinks() {
    return this._linksPromise || (this._linksPromise = this._loadLinks())
  }
  async file(name) {
    const links = await this._getLinks()
    for (const l of links) {
      if (l.name.toLowerCase() === name.toLowerCase()) {
        return new LimitedConcurrencyResource(
          this._throat,
          new NativeIPFSFileResource(l.multihash, l.name)
        )
      }
    }
    throw new Error('unable to find ' + name)
  }
  get fileList() {
    return this._getLinks().then((links) => links.map((l) => l.name))
  }
}

class NativeIPFSFileResource {
  constructor(multihash, name) {
    this._multihash = multihash
    this._name = name
  }
  read(progress) {
    return ProgressUtils.atomic(
      progress,
      window.ipfs.files.cat(this._multihash).then((a) => a.buffer)
    )
  }
  get name() {
    return this._name
  }
}

class GatewayIPFSResources {
  constructor(ipfsPath, gateway = 'https://cloudflare-ipfs.com') {
    this._path = ipfsPath
    this._gateway = gateway
  }
  get gatewayName() {
    return `IPFS gateway "${this._gateway}"`
  }
  _throat = throat(7)
  async _loadLinks() {
    const url = `${this._gateway}${this._path}`
    const response = await axios.get(url, { responseType: 'text' })
    const data = response.data
    const out = []
    const prefix = this._path.replace(/\/?$/, '/')
    data.replace(/"(\/ipfs\/[^"]+)"/g, (a, encodedPathname) => {
      if (encodedPathname.substr(0, prefix.length) === prefix) {
        out.push({
          Name: decodeURIComponent(encodedPathname.substr(prefix.length)),
        })
      }
    })
    if (!out.length) {
      throw new Error('No files found :( Is this really an IPFS folder?')
    }
    return out
  }
  _getLinks() {
    return this._linksPromise || (this._linksPromise = this._loadLinks())
  }
  async file(name) {
    const links = await this._getLinks()
    const base = this._path.replace(/^\/|\/$/g, '').split('/')
    for (const l of links) {
      if (l.Name.toLowerCase() === name.toLowerCase()) {
        const pathname =
          '/' + [...base, l.Name].map((x) => encodeURIComponent(x)).join('/')
        return new LimitedConcurrencyResource(
          this._throat,
          new URLResource(`${this._gateway}${pathname}`)
        )
      }
    }
    throw new Error('unable to find ' + name)
  }
  get fileList() {
    return this._getLinks().then((links) => links.map((l) => l.Name))
  }
}

class LimitedConcurrencyResource {
  constructor(_throat, resource) {
    this._throat = _throat
    this._resource = resource
  }
  read(progress) {
    return this._throat(() => this._resource.read(progress))
  }
  resolveUrl() {
    return this._resource.resolveUrl()
  }
  get name() {
    return this._resource.name
  }
}
