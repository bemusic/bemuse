
import readBlob from '../read-blob'
import defaultAudioContext from 'audio-context'

export class SamplingMaster {

  constructor(audioContext) {
    this._audioContext  = audioContext || defaultAudioContext
    this._samples       = []
    this._instances     = new Set()
  }

  /**
   * Connects a dummy node to the audio, thereby unmuting the audio system on
   * iOS devices.
   */
  unmute() {
    unmuteAudio(this._audioContext)
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
      return sample
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
    return new Promise((resolve, reject) => {
      this.audioContext.decodeAudioData(arrayBuffer,
        function decodeAudioDataSuccess(audioBuffer) {
          resolve(audioBuffer)
        },
        function decodeAudioDataFailure(e) {
          reject('Unable to decode audio: ' + e)
        }
      )
    })
  }

  _startPlaying(instance) {
    this._instances.add(instance)
  }

  _stoppedPlaying(instance) {
    this._instances.delete(instance)
  }

}

class Sample {

  constructor(samplingMaster, audioBuffer) {
    this._master = samplingMaster
    this._buffer = audioBuffer
  }

  play(delay, node) {
    return new PlayInstance(this._master, this._buffer, delay, node)
  }

  destroy() {
    this._master = null
    this._buffer = null
  }

}

class PlayInstance {

  constructor(samplingMaster, buffer, delay, node) {
    delay = delay || 0
    this._master = samplingMaster
    let context = samplingMaster.audioContext
    let source = context.createBufferSource()
    source.buffer = buffer
    source.onended = () => this.stop()
    let gain = context.createGain()
    source.connect(gain)
    gain.connect(node || context.destination)
    this._source = source
    this._gain = gain
    source.start(!delay ? 0 : Math.max(0, context.currentTime + delay))
    this._master._startPlaying(this)
  }

  stop() {
    if (!this._source) return
    this._source.stop(0)
    this._source.disconnect()
    this._gain.disconnect()
    this._source = null
    this._gain = null
    this._master._stoppedPlaying(this)
    if (this.onstop) this.onstop()
  }

  bad() {
    if (!this._source) return
    this._source.playbackRate.value = (Math.random() < 0.5 ?
      Math.pow(2,  1 / 12) :
      Math.pow(2, -1 / 12))
  }

  destroy() {
    this.stop()
  }

}

export default SamplingMaster

export function unmuteAudio(ctx) {
  let gain = ctx.createGain()
  gain.connect(ctx.destination)
  gain.disconnect()
}

