import defaultAudioContext from 'bemuse/audio-context'
import readBlob from 'bemuse/utils/read-blob'

export const FADE_LENGTH = 0.001

let dummyAudioTag = document.createElement('audio')

// Checks whether an audio format is supported.
export function canPlay (type) {
  return dummyAudioTag.canPlayType(type) === 'probably'
}

// The sampling master is a wrapper class around Web Audio API
// that takes care of:
//
// - Decoding audio from an ArrayBuffer or Blob (resulting in a "Sample").
// - Playing the `Sample` and managing its lifecycle.
export class SamplingMaster {
  constructor (audioContext) {
    this._audioContext = audioContext || defaultAudioContext
    this._samples = []
    this._groups = []
    this._instances = new Set()
    this._destination = this._audioContext.destination
  }

  // Connects a dummy node to the audio, thereby unmuting the audio system on
  // iOS devices (which keeps the audio muted until a user interacts with the
  // page).
  unmute () {
    unmuteAudio(this._audioContext)
  }

  // The underlying AudioContext.
  get audioContext () {
    return this._audioContext
  }

  // The audio destination.
  get destination () {
    return this._destination
  }

  // Destroys this SamplingMaster, make it unusable.
  destroy () {
    if (this._destroyed) return
    this._destroyed = true
    for (let sample of this._samples) sample.destroy()
    for (let instance of this._instances) instance.destroy()
    this._samples = null
    this._instances = null
  }

  // Decodes the audio data from a Blob or an ArrayBuffer.
  // Returns an AudioBuffer which can be re-used in other sampling masters.
  decode (blobOrArrayBuffer) {
    return this._coerceToArrayBuffer(blobOrArrayBuffer).then(arrayBuffer =>
      this._decodeAudio(arrayBuffer)
    )
  }

  // Creates a `Sample` from a Blob or an ArrayBuffer or an AudioBuffer.
  sample (blobOrArrayBufferOrAudioBuffer) {
    const audioBufferPromise = (() => {
      if (blobOrArrayBufferOrAudioBuffer.numberOfChannels) {
        return Promise.resolve(blobOrArrayBufferOrAudioBuffer)
      } else {
        return this.decode(blobOrArrayBufferOrAudioBuffer)
      }
    })()
    return audioBufferPromise.then(audioBuffer => {
      if (this._destroyed) throw new Error('SamplingMaster already destroyed!')
      var sample = new Sample(this, audioBuffer)
      this._samples.push(sample)
      return sample
    })
  }

  group (options) {
    const group = new SoundGroup(this, options)
    this._groups.push(group)
    return group
  }

  _coerceToArrayBuffer (blobOrArrayBuffer) {
    if (blobOrArrayBuffer instanceof ArrayBuffer) {
      return Promise.resolve(blobOrArrayBuffer)
    } else {
      return readBlob(blobOrArrayBuffer).as('arraybuffer')
    }
  }

  _decodeAudio (arrayBuffer) {
    return new Promise((resolve, reject) => {
      this.audioContext.decodeAudioData(
        arrayBuffer,
        function decodeAudioDataSuccess (audioBuffer) {
          resolve(audioBuffer)
        },
        function decodeAudioDataFailure (e) {
          reject(new Error('Unable to decode audio: ' + e))
        }
      )
    })
  }

  _startPlaying (instance) {
    this._instances.add(instance)
  }

  _stoppedPlaying (instance) {
    this._instances.delete(instance)
  }
}

// Sound group
class SoundGroup {
  constructor (samplingMaster, { volume } = {}) {
    this._master = samplingMaster
    this._gain = this._master.audioContext.createGain()
    if (volume != null) this._gain.gain.value = volume
    this._gain.connect(this._master.destination)
  }

  get destination () {
    return this._gain
  }

  destroy () {
    this._gain.disconnect()
    this._gain = null
  }
}

// The Sample is created by and belongs to the `SamplingMaster`.
//
// You don't invoke this constructor directly; it is invoked by
// `SamplingMaster#create`.
class Sample {
  constructor (samplingMaster, audioBuffer) {
    this._master = samplingMaster
    this._buffer = audioBuffer
  }

  // Plays the sample and returns the new PlayInstance.
  play (delay, options) {
    return new PlayInstance(this._master, this._buffer, delay, options)
  }

  // Destroys this sample, thereby making it unusable.
  destroy () {
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
  constructor (samplingMaster, buffer, delay, options = {}) {
    delay = delay || 0
    this._master = samplingMaster

    // Connect all the stuff...
    let context = samplingMaster.audioContext
    let source = context.createBufferSource()
    source.buffer = buffer
    source.onended = () => this.stop()
    let gain = context.createGain()
    source.connect(gain)
    let destination =
      options.node ||
      (options.group && options.group.destination) ||
      samplingMaster.destination
    gain.connect(destination)
    this._source = source
    this._gain = this.TEST_node = gain

    // Start the sound.
    let startTime = !delay ? 0 : Math.max(0, context.currentTime + delay)
    let startOffset = options.start || 0
    let fadeIn = startOffset > 0
    let fadeOutAt = false
    if (fadeIn) {
      gain.gain.setValueAtTime(0, 0)
    }
    if (options.end !== undefined) {
      let duration = Math.max(options.end - startOffset, 0)
      source.start(startTime, startOffset, duration + FADE_LENGTH)
      fadeOutAt = context.currentTime + delay + duration
    } else {
      source.start(startTime, startOffset)
    }
    if (fadeIn) {
      gain.gain.setValueAtTime(0, context.currentTime + delay)
      gain.gain.linearRampToValueAtTime(
        1,
        context.currentTime + delay + FADE_LENGTH
      )
    }
    if (fadeOutAt !== false) {
      gain.gain.setValueAtTime(1, fadeOutAt)
      gain.gain.linearRampToValueAtTime(0, fadeOutAt + FADE_LENGTH)
    }
    this._master._startPlaying(this)
  }

  // Stops the sample and disconnects the underlying Web Audio nodes.
  stop () {
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
  bad () {
    if (!this._source) return
    this._source.playbackRate.value =
      Math.random() < 0.5 ? Math.pow(2, 1 / 24) : Math.pow(2, -1 / 24)
  }

  // Destroys this PlayInstance.
  destroy () {
    this.stop()
  }
}

export default SamplingMaster

// Enables Web Audio on iOS. By default, on iOS, audio is disabled.
// This function must be called before audio will start working. It must be
// called as a response to some user interaction (e.g. touchstart).
//
export function unmuteAudio (ctx = defaultAudioContext) {
  // Perform some strange magic to unmute the audio on iOS devices.
  // This code doesn’t make sense at all, you know.
  let gain = ctx.createGain()
  let osc = ctx.createOscillator()
  osc.frequency.value = 440
  osc.start(ctx.currentTime + 0.1)
  osc.stop(ctx.currentTime + 0.1)
  gain.connect(ctx.destination)
  gain.disconnect()
}
