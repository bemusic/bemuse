import SamplingMaster, { Sample } from 'bemuse/sampling-master'

import _ from 'lodash'
import context from 'bemuse/audio-context'
import download from 'bemuse/utils/download'

/**
 * The asset URL of these files...
 */
const ASSET_URLS = {
  bgm: require('./data/bgm.ogg'),
  intro: require('./data/intro.ogg'),
  kick: require('./data/kick.ogg'),
  snare: require('./data/snare.ogg'),
} as const
type AssetKey = keyof typeof ASSET_URLS

type Samples = Record<AssetKey, Sample>

/**
 * Loads the files and create a music instance.
 */
export async function load() {
  const master = new SamplingMaster(context)

  const sample = (name: AssetKey) =>
    download(ASSET_URLS[name])
      .as('arraybuffer')
      .then((buf) => master.sample(buf))
  const samples = _.fromPairs(
    await Promise.all(
      (Object.keys(ASSET_URLS) as readonly AssetKey[]).map(async (name) => {
        const sampleObj = await sample(name)
        return [name, sampleObj]
      })
    )
  ) as Samples
  return music(master, samples)
}

export type SampleRecord = [beat: number, deltaTime: number]

/**
 * Takes the sample and sequences a music
 */
function music(master: SamplingMaster, samples: Samples) {
  return function play(callbacks: { a: () => void }) {
    master.unmute()

    const BPM = 148
    const time = new AudioTime(context, -1)

    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 0
    filter.Q.value = 10
    filter.connect(context.destination)

    type State = {
      part2: null | {
        begin: number
      }
      ok?: boolean
    }
    const state: State = { part2: null }

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
      progress(p: number) {
        filter.frequency.value = 20000 * p * p * p
      },
      getSample(): SampleRecord {
        const nearestBeat = Math.round((time.t * BPM) / 60)
        const nearestBeatTime = (nearestBeat * 60) / BPM
        return [nearestBeat, time.t - nearestBeatTime]
      },
    }
  }
}

function beatSequencer(
  bpm: number,
  f: (beat: number, deltaTime: number) => void
) {
  let beat = -1
  return (time: number) => {
    const nowBeat = Math.floor(((time + 0.1) * bpm) / 60)
    while (beat < nowBeat) {
      beat += 1
      const beatTime = (beat * 60) / bpm
      f(beat, beatTime - time)
    }
  }
}

class AudioTime {
  constructor(
    private readonly audioContext: AudioContext,
    private readonly leadTime: number
  ) {}

  private start = this.audioContext.currentTime

  get t() {
    return this.audioContext.currentTime - this.start + this.leadTime
  }
}
