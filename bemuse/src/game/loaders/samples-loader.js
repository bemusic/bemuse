import * as ProgressUtils from 'bemuse/progress/utils'
import _ from 'lodash'
import defaultKeysoundCache from 'bemuse/keysound-cache'
import { EXTRA_FORMATTER } from 'bemuse/progress/formatters'
import { PromisePool } from '@supercharge/promise-pool'

export class SamplesLoader {
  constructor(assets, master, { keysoundCache = defaultKeysoundCache } = {}) {
    this._assets = assets
    this._master = master
    this._keysoundCache = keysoundCache
  }

  loadFiles(files, loadProgress, decodeProgress) {
    const onload = ProgressUtils.fixed(files.length, loadProgress)
    const ondecode = ProgressUtils.fixed(files.length, decodeProgress)
    const load = (name) =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve(this._loadSample(name, onload, ondecode))
        })
      })
    if (decodeProgress) decodeProgress.formatter = EXTRA_FORMATTER
    return PromisePool.withConcurrency(64)
      .for(files)
      .process(load)
      .then(({ results: arr }) => _(arr).filter().fromPairs().value())
  }

  async _loadSample(name, onload, ondecode) {
    const audioBufferPromise = (async () => {
      if (this._keysoundCache.isCached(name)) {
        const cache = await this._keysoundCache.get(name)
        onload(name)
        ondecode(name)
        return cache
      }
      const file = await this._getFile(name)
      const buffer = await file.read()
      onload(name)
      const audioBuffer = await this._decode(buffer)
      this._keysoundCache.cache(name, audioBuffer)
      ondecode(name)
      return audioBuffer
    })()
    try {
      const audioBuffer = await audioBufferPromise

      const sample = await this._master.sample(audioBuffer)
      return [name, sample]
    } catch (e) {
      console.error('Unable to load keysound: ' + name, e)
      return null
    }
  }

  _decode(buffer) {
    return this._master.decode(buffer)
  }

  _getFile(name) {
    name = name.replace(/\\/g, '/')
    return this._assets
      .file(name.replace(/\.\w+$/, '.ogg'))
      .catch(() => this._assets.file(name.replace(/\.\w+$/, '.m4a')))
      .catch(() => this._assets.file(name.replace(/\.\w+$/, '.mp3')))
      .catch(() => this._assets.file(name))
  }
}

export default SamplesLoader
