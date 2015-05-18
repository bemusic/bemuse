
import _                    from 'lodash'
import * as ProgressUtils   from 'bemuse/progress/utils'
import { EXTRA_FORMATTER }  from 'bemuse/progress/formatters'
import { canPlay }          from 'bemuse/sampling-master'

export class SamplesLoader {
  constructor(assets, master) {
    this._assets = assets
    this._master = master
  }
  loadFiles(files, loadProgress, decodeProgress) {
    let onload    = ProgressUtils.fixed(files.length, loadProgress)
    let ondecode  = ProgressUtils.fixed(files.length, decodeProgress)
    let load      = name => this._loadSample(name, onload, ondecode)
    if (decodeProgress) decodeProgress.formatter = EXTRA_FORMATTER
    return Promise.map(files, load)
        .then(arr => _(arr).filter().object().value())
  }
  _loadSample(name, onload, ondecode) {
    return this._getFile(name).then(
      file => file.read()
        .tap(() => onload(name))
        .then(buffer => this._decode(buffer))
        .tap(() => ondecode(name))
        .then(sample => [name, sample])
        .catch(e => {
          console.error('Unable to decode: ' + name, e)
          return null
        }),
      (e) => {
        console.error('Unable to read: ' + name, e)
        return null
      }
    )
  }
  _decode(buffer) {
    return this._master.sample(buffer)
  }
  _getFile(name) {
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
