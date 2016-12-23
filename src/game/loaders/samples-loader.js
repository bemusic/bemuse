import * as ProgressUtils   from 'bemuse/progress/utils'
import _                    from 'lodash'
import defaultKeysoundCache from 'bemuse/keysound-cache'
import { EXTRA_FORMATTER }  from 'bemuse/progress/formatters'
import { canPlay }          from 'bemuse/sampling-master'

export class SamplesLoader {
  constructor (assets, master, { keysoundCache = defaultKeysoundCache } = { }) {
    this._assets = assets
    this._master = master
    this._keysoundCache = keysoundCache
  }
  loadFiles (files, loadProgress, decodeProgress) {
    let onload    = ProgressUtils.fixed(files.length, loadProgress)
    let ondecode  = ProgressUtils.fixed(files.length, decodeProgress)
    let load      = name => new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve(this._loadSample(name, onload, ondecode))
      })
    })
    if (decodeProgress) decodeProgress.formatter = EXTRA_FORMATTER
    return Promise.map(files, load, { concurrency: 64 })
        .then(arr => _(arr).filter().fromPairs().value())
  }
  _loadSample (name, onload, ondecode) {
    const audioBufferPromise = (() => {
      if (this._keysoundCache.isCached(name)) {
        return Promise.resolve(this._keysoundCache.get(name)).tap(() => {
          onload(name)
          ondecode(name)
        })
      } else {
        return this._getFile(name).then(file => file.read()
          .tap(() => {
            onload(name)
          })
          .then((buffer) => this._decode(buffer))
          .tap((audioBuffer) => {
            this._keysoundCache.cache(name, audioBuffer)
            ondecode(name)
          })
        )
      }
    })()
    return (audioBufferPromise
      .then((audioBuffer) => this._master.sample(audioBuffer))
      .then((sample) => [ name, sample ])
      .catch((e) => {
        console.error('Unable to load keysound: ' + name, e)
        return null
      })
    )
  }
  _decode (buffer) {
    return this._master.decode(buffer)
  }
  _getFile (name) {
    return Promise.try(() => {
      if (!canPlay('audio/ogg; codecs="vorbis"')) {
        throw new Error('cannot play OGG')
      }
      return this._assets.file(name.replace(/\.\w+$/, '.ogg'))
    })
    .catch(() => this._assets.file(name.replace(/\.\w+$/, '.m4a')))
    .catch(() => this._assets.file(name.replace(/\.\w+$/, '.mp3')))
    .catch(() => this._assets.file(name))
  }
}

export default SamplesLoader
