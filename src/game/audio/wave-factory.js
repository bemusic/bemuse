
export class WaveFactory {

  constructor(master, samples) {
    void master
    void samples
  }

  // Plays an autokeysound note (using limited polyphony)
  playAuto(keysound) {
    void keysound
  }

  // Plays a hit note (using limited polyphony)
  // Returns the SoundInstance which may be stopped when hold note is missed
  playNote(keysound) {
    void keysound
  }

  // Plays a note when hitting in the blank area (unlimited polyphony)
  playFree(keysound) {
    void keysound
  }

}

export default WaveFactory
