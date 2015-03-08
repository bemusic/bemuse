
export class WaveFactory {

  constructor(master, samples, map) {
    this._master  = master
    this._samples = samples
    this._map     = map
  }

  // Plays an autokeysound note (using limited polyphony)
  playAuto(keysound, delay) {
    this._play({ keysound, delay, exclusive: true })
  }

  // Plays a hit note (using limited polyphony)
  // Returns the SoundInstance which may be stopped when hold note is missed
  playNote(keysound, delay) {
    this._play({ keysound, delay, exclusive: true })
  }

  // Plays a note when hitting in the blank area (unlimited polyphony)
  playFree(keysound) {
    this._play({ keysound, delay: 0, exclusive: false })
  }

  // Plays a note
  _play({ keysound, delay, exclusive }) {
    let filename  = this._map[keysound.toLowerCase()]
    if (!filename) return
    let sample    = this._samples[filename]
    if (!sample) return
    sample.play(delay)
    void exclusive
  }

}

export default WaveFactory
