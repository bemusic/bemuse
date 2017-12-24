
import now from 'bemuse/utils/now'

// The game clock provides a high-accuracy time source for the game.
//
// We want our timing to be based on audio. If the audio lags, the time
// clock should lag with the audio as well, in order to keep the game
// time in sync with the background audio.
//
// But there is a problem on some browsers (Android):
// ``AudioContext.currentTime`` is not precise. Therefore, we take the
// average of the offset between system time (which is more precise)
// and the audio time to compute a high-precision-and-accuracy time.
//
export class Clock {
  constructor (audio) {
    audio.unmute() // kick start the currentTime of audio context

    this._context = audio.context
    this._offset = []
    this._sum = 0
    this.update()
  }

  // Updates the clock. This method should be called every frame.
  update () {
    let realTime = now() / 1000
    let delta = realTime - this._context.currentTime
    this._offset.push(delta)
    this._sum += delta
    while (this._offset.length > 60) {
      this._sum -= this._offset.shift()
    }

    // The clock's time value, in seconds.
    this.time = realTime - this._sum / this._offset.length
  }
}

export default Clock
