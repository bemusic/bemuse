
import R from 'ramda'
import SamplingMaster from 'bemuse/sampling-master'
import throat from 'throat'

export class AudioLoader {
  constructor(assets, master) {
    this._assets = assets
    this._master = master || new SamplingMaster()
  }
  loadFrom(keysounds) {
    let files = keysounds.files()
    let notifier = new ProgressNotifier(files.length,
                          this.audioTask, this.decodeTask)
    let load = name => this._loadSample(name, notifier)
    return Promise.map(files, load).then(R.fromPairs)
  }
  _loadSample(name, notifier) {
    let decode = throat(8, buffer => this._master.sample(buffer))
    return this._getFile(name)
      .then(
        file => file.read()
          .tap(() => notifier.loaded(name))
          .then(decode)
          .tap(() => notifier.decoded(name))
          .then(sample => [name, sample])
          .catch(e => {
            console.error('Unable to decode: ' + name, e)
            return null
          }),
        () => null
      )
  }
  _getFile(name) {
    return this._assets.file(name)
      .catch(() => this._assets.file(name.replace(/\.\w+$/, '.mp3')))
  }
}

export default AudioLoader

function ProgressNotifier(total, load, decode) {
  let a = 0
  let b = 0
  return {
    loaded: function(name) {
      a += 1
      load.update({ current: a, total, progress: a / total })
      void name
    },
    decoded: function(name) {
      b += 1
      decode.update({ text: 'Decoded ' + name, progress: b / total })
    },
  }
}
