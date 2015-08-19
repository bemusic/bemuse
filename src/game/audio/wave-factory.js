
export class WaveFactory {

  constructor(master, samples, map) {
    this._master              = master
    this._samples             = samples
    this._map                 = map
    this._exclusiveInstances  = new Map()
  }

  // Plays an autokeysound note (using limited polyphony)
  playAuto(note, delay, slice) {
    return this._play({ note, delay, exclusive: true, slice })
  }

  // Plays a hit note (using limited polyphony)
  // Returns the SoundInstance which may be stopped when hold note is missed
  playNote(note, delay, slice) {
    return this._play({ note, delay, exclusive: true, slice })
  }

  // Plays a note when hitting in the blank area (unlimited polyphony)
  playFree(note, delay, slice) {
    return this._play({ note, delay: 0, exclusive: false, slice })
  }

  // Plays a note
  _play({ note, delay, exclusive }) {
    let keysound = note.keysound
    if (exclusive) this._stopOldExclusiveSound(keysound, delay)
    let filename = this._map[keysound.toLowerCase()]
    if (!filename) return null
    let sample = this._samples[filename]
    if (!sample) return null
    let instance = sample.play(delay, {
      start: note.keysoundStart,
      end: note.keysoundEnd
    })
    if (exclusive) this._exclusiveInstances.set(keysound, instance)
    return instance
  }

  _stopOldExclusiveSound(keysound, delay) {
    let instance = this._exclusiveInstances.get(keysound)
    if (instance) {
      setTimeout(() => instance.stop(), delay * 1000)
      this._exclusiveInstances.delete(keysound)
    }
  }

}

export default WaveFactory
