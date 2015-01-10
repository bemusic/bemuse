
import readBlob from '../read-blob'

export default SamplingMaster

export class SamplingMaster {

  constructor(audioContext) {
    this._audioContext = audioContext
    this._samples = []
    this._instances = new Set()
  }

  get audioContext() {
    return this._audioContext
  }

  destroy() {
    if (this._destroyed) return
    this._destroyed = true
    for (let sample of this._samples) sample.destroy()
    for (let instance of this._instances) instance.destroy()
    this._samples = null
    this._instances = null
  }

  sample(blobOrArrayBuffer) {
    return this._coerceToArrayBuffer(blobOrArrayBuffer)
    .then(arrayBuffer => this._decodeAudio(arrayBuffer))
    .then(audioBuffer => {
      if (this._destroyed) throw new Error('SamplingMaster already destroyed!')
      var sample = new Sample(this, audioBuffer)
      this._samples.push(sample)
    })
  }

  _coerceToArrayBuffer(blobOrArrayBuffer) {
    if (blobOrArrayBuffer instanceof ArrayBuffer) {
      return Promise.resolve(blobOrArrayBuffer)
    } else {
      return readBlob(blobOrArrayBuffer).as('arraybuffer')
    }
  }

  _decodeAudio(arrayBuffer) {
    return new Promise(function(resolve, reject) {
      this.audioContext.decodeAudioData(arrayBuffer,
        function decodeAudioDataSuccess(audioBuffer) {
          resolve(audioBuffer)
        },
        function decodeAudioDataFailure(err) {
          reject(err)
        }
      )
    })
  }

  _startPlaying(instance) {
    this._instances.push(instance)
  }

  _stopPlaying(instance) {
    var index = this._instances.indexOf(instance)
    if (index > -1) this._instances.splice(index, 1)
  }

}

class Sample {

  constructor(samplingMaster, audioBuffer) {
    this._master = samplingMaster
    this._buffer = audioBuffer
  }

  play() {
    return new PlayInstance(this._master, this._buffer)
  }

  destroy() {
    this._master = null
    this._buffer = null
  }

}

class PlayInstance {

  constructor(samplingMaster, buffer) {
    let context = samplingMaster.audioContext
    let source = context.createBufferSource()
    source.buffer = buffer
    let gain = context.createGain()
    source.connect(gain)
    gain.connect(context.desination)
    this._source = source
    this._gain = gain
    source.play(0)
    this.setTimeout(() => this.stop(), buffer.duration * 1000)
    samplingMaster._startPlaying(this)
  }

  stop() {
    if (!this._source) return
    this._source.stop(0)
    this._source.disconnect()
    this._gain.disconnect()
    this._source = null
    this._gain = null
    samplingMaster._stoppedPlaying(this)
  }

  destroy() {
    this.stop()
  }

}

