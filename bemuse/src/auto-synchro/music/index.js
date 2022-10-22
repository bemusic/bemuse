import _ from 'lodash'
import context from 'bemuse/audio-context'
import download from 'bemuse/utils/download'
import SamplingMaster from 'bemuse/sampling-master'

/**
 * The asset URL of these files...
 */
const ASSET_URLS = {
  'bgm.ogg': require('./data/bgm.ogg'),
  'intro.ogg': require('./data/intro.ogg'),
  'kick.ogg': require('./data/kick.ogg'),
  'snare.ogg': require('./data/snare.ogg'),
}

/**
 * Loads the files and create a music instance.
 */
export async function load() {
  const master = new SamplingMaster(context)

  const sample = (name) =>
    download(ASSET_URLS[`${name}.ogg`])
      .as('arraybuffer')
      .then((buf) => master.sample(buf))
  const samples = _.fromPairs(
    await Promise.all(
      ['bgm', 'intro', 'kick', 'snare'].map((name) =>
        sample(name).then((sampleObj) => [name, sampleObj])
      )
    )
  )
  return music(master, samples)
}

/**
 * Takes the sample and sequences a music
 */
function music(master, samples) {
  return function play(callbacks) {
    master.unmute()

    const BPM = 148
    const time = new AudioTime(context, -1)

    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 0
    filter.Q.value = 10
    filter.connect(context.destination)

    const state = { part2: null }

    const sequence = beatSequencer(BPM, (beat, delay) => {
      if (beat % 8 !== 7) {
        samples.kick.play(delay)
      }
      if (state.part2 !== null) {
        beat -= state.part2.begin
        if (beat % 128 === 0) {
          samples.bgm.play(delay)
        }
      } else {
        if (beat % 32 === 0) {
          samples.intro.play(delay, { node: filter })
        }
        if (beat % 32 === 31) {
          if (state.ok === true) {
            samples.snare.play(delay)
            state.part2 = { begin: beat + 1 }
            callbacks.a()
          }
        }
      }
    })

    setInterval(() => sequence(time.t), 33)

    return {
      ok() {
        state.ok = true
      },
      progress(p) {
        filter.frequency.value = 20000 * p * p * p
      },
      getSample() {
        const nearestBeat = Math.round((time.t * BPM) / 60)
        const nearestBeatTime = (nearestBeat * 60) / BPM
        return [nearestBeat, time.t - nearestBeatTime]
      },
    }
  }
}

function beatSequencer(bpm, f) {
  let beat = -1
  return (time) => {
    const nowBeat = Math.floor(((time + 0.1) * bpm) / 60)
    while (beat < nowBeat) {
      beat += 1
      const beatTime = (beat * 60) / bpm
      f(beat, beatTime - time)
    }
  }
}

class AudioTime {
  constructor(audioContext, leadTime) {
    this._context = audioContext
    this._start = audioContext.currentTime
    this._startTime = leadTime
  }

  get t() {
    return this._context.currentTime - this._start + this._startTime
  }
}
