
export class Clock {
  constructor(audio) {
    audio.unmute() // kick start the currentTime of audio context
    this._context = audio.context
    this._offset  = []
    this._sum     = 0
    this.update()
  }
  update() {
    let realTime  = new Date().getTime() / 1000
    let delta     = realTime - this._context.currentTime
    this._offset.push(delta)
    this._sum += delta
    while (this._offset.length > 60) {
      this._sum -= this._offset.shift()
    }
    this.time = realTime - this._sum / this._offset.length
  }
}

export default Clock
