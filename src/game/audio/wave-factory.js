
export class WaveFactory {

  constructor(master, samples, map) {
    this._master              = master
    this._samples             = samples
    this._map                 = map
    this._exclusiveInstances  = new Map()
  }

  // Plays an autokeysound note (using limited polyphony)
  playAuto(keysound, delay) {
    return this._play({ keysound, delay, exclusive: true })
  }

  // Plays a hit note (using limited polyphony)
  // Returns the SoundInstance which may be stopped when hold note is missed
  playNote(keysound, delay) {
    return this._play({ keysound, delay, exclusive: true })
  }

  // Plays a note when hitting in the blank area (unlimited polyphony)
  playFree(keysound) {
    return this._play({ keysound, delay: 0, exclusive: false })
  }

  // Plays a note
  _play({ keysound, delay, exclusive }) {
    if (exclusive) this._stopOldExclusiveSound(keysound)
    let filename = this._map[keysound.toLowerCase()]
    if (!filename) return
    let sample = this._samples[filename]
    if (!sample) return
    let instance = sample.play(delay)
    if (exclusive) this._exclusiveInstances.set(keysound, instance)
    return instance
  }

  _stopOldExclusiveSound(keysound) {
    let instance = this._exclusiveInstances.get(keysound)
    if (instance) {
      instance.stop()
      this._exclusiveInstances.delete(keysound)
    }
  }

}

export default WaveFactory
