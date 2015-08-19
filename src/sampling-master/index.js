
import readBlob from 'bemuse/utils/read-blob'
import defaultAudioContext from 'audio-context'

let dummyAudioTag = document.createElement('audio')

// Checks whether an audio format is supported.
export function canPlay(type) {
  return dummyAudioTag.canPlayType(type) === 'probably'
}

// The sampling master is a wrapper class around Web Audio API
// that takes care of:
//
// - Decoding audio from an ArrayBuffer or Blob (resulting in a "Sample").
// - Playing the `Sample` and managing its lifecycle.
export class SamplingMaster {
  constructor(audioContext) {
    this._audioContext  = audioContext || defaultAudioContext
    this._samples       = []
    this._instances     = new Set()
  }

  // Connects a dummy node to the audio, thereby unmuting the audio system on
  // iOS devices (which keeps the audio muted until a user interacts with the
  // page).
  unmute() {
    unmuteAudio(this._audioContext)
  }

  // The underlying AudioContext.
  get audioContext() {
    return this._audioContext
  }

  // Destroys this SamplingMaster, make it unusable.
  destroy() {
    if (this._destroyed) return
    this._destroyed = true
    for (let sample of this._samples) sample.destroy()
    for (let instance of this._instances) instance.destroy()
    this._samples = null
    this._instances = null
  }

  // Creates a `Sample` from a Blob or an ArrayBuffer.
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

// The Sample is created by and belongs to the `SamplingMaster`.
//
// You don't invoke this constructor directly; it is invoked by
// `SamplingMaster#create`.
class Sample {

  constructor(samplingMaster, audioBuffer) {
    this._master = samplingMaster
    this._buffer = audioBuffer
  }

  // Plays the sample and returns the new PlayInstance.
  play(delay, options) {
    return new PlayInstance(this._master, this._buffer, delay, options)
  }

  // Destroys this sample, thereby making it unusable.
  destroy() {
    this._master = null
    this._buffer = null
  }

}

// When a `Sample` is played, a PlayInstance is created.
// A PlayInstance may not be reused; after the sound finishes playing,
// you have to invoke `Sample#play` again.
//
// You don't invoke this constructor directly; it is invoked by `Sample#play`.
class PlayInstance {
  constructor(samplingMaster, buffer, delay, options) {
    delay = delay || 0
    options = options || { }
    this._master = samplingMaster
    let context = samplingMaster.audioContext
    let source = context.createBufferSource()
    source.buffer = buffer
    source.onended = () => this.stop()
    let gain = context.createGain()
    source.connect(gain)
    let node = options.node || context.destination
    gain.connect(node)
    this._source = source
    this._gain = gain
    let startTime   = !delay ? 0 : Math.max(0, context.currentTime + delay)
    let startOffset = options.start || 0
    if (options.end !== undefined) {
      let duration  = Math.max(options.end - startOffset, 0)
      source.start(startTime, startOffset, duration)
    } else {
      source.start(startTime, startOffset)
    }
    this._master._startPlaying(this)
  }

  // Stops the sample and disconnects the underlying Web Audio nodes.
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

  // Makes this PlayInstance sound off-pitch, as a result of badly hitting
  // a note.
  bad() {
    if (!this._source) return
    this._source.playbackRate.value = (Math.random() < 0.5 ?
      Math.pow(2,  1 / 12) :
      Math.pow(2, -1 / 12))
  }

  // Destroys this PlayInstance.
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
