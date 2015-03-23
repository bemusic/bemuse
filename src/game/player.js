
export class Player {
  constructor(notechart, playerNumber, options) {
    this._notechart = notechart
    this._number    = playerNumber
    this._options   = {
      autosound: !!options.autosound,
    }
  }
  get columns() {
    return this._notechart.columns
  }
  get notechart() {
    return this._notechart
  }
  get number() {
    return this._number
  }
  get options() {
    return this._options
  }
}

export default Player
