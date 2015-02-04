
import download       from '../download'
import co             from 'co'
import once           from 'once'
import SamplingMaster from '../sampling-master'
import context        from 'audio-context'
import R              from 'ramda'

/**
 * Checks whether an audio format is supported.
 */
let canPlay = (() => {
  let dummyAudioTag = document.createElement('audio')
  return (type) => dummyAudioTag.canPlayType(type) === 'probably'
})()

/**
 * The audio format to use (.ogg or .m4a)
 */
let audioExt =  once(() =>
                  canPlay('audio/ogg; codecs="vorbis"') ? '.ogg' : '.m4a')

/**
 * Loads the files and create a music instance.
 */
export function load() {
  return co(function*() {
    let master  = new SamplingMaster(context)
    let sample  =
          name => download(`/sounds/sync/${name}${audioExt()}`)
            .as('arraybuffer')
            .then(buf => master.sample(buf))
    let samples = R.fromPairs(
          yield Promise.all(
            ['bgm', 'intro', 'kick', 'snare'].map(
              name => sample(name).then(sample => [name, sample]))))
    return music(master, samples)
  })
}

/**
 * Takes the sample and sequences a music
 */
function music(master, samples) {
  return function play() {

    let BPM = 148
    let time = new AudioTime(context, -1)

    let filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 0
    filter.Q.value = 10
    filter.connect(context.destination)

    let state = { part2: null }

    let sequence = beatSequencer(BPM, (beat, delay) => {
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
          samples.intro.play(delay, filter)
        }
        if (beat % 32 === 31) {
          if (state.ok === true) {
            samples.snare.play(delay)
            state.part2 = { begin: beat + 1}
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
        let nearestBeat = Math.round(time.t * BPM / 60)
        let nearestBeatTime = nearestBeat * 60 / BPM
        return nearestBeatTime - time.t
      },
    }

  }
}

function beatSequencer(bpm, f) {
  let beat = -1
  return (time) => {
    let nowBeat = Math.floor((time + 0.1) * bpm / 60)
    while (beat < nowBeat) {
      beat += 1
      let beatTime = beat * 60 / bpm
      f(beat, beatTime - time)
    }
  }
}

class AudioTime {
  constructor(context, leadTime) {
    this._context = context
    this._start = context.currentTime
    this._startTime = leadTime
  }
  get t() {
    return context.currentTime - this._start + this._startTime
  }
}




