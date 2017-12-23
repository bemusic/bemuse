
// The object representing the player's information, notechart and options.
export class Player {
  constructor (notechart, playerNumber, options) {
    this._notechart = notechart
    this._number    = playerNumber
    this._options   = {
      autosound: !!options.autosound,
      speed:      +options.speed,
      placement:   options.placement || 'center',
      scratch:     options.scratch || 'left',
      input:       options.input,
      laneCover:  +options.laneCover || 0,
      gauge:       options.gauge,
      tutorial:  !!options.tutorial
    }
  }

  // The Notechart object.
  get notechart () {
    return this._notechart
  }

  // An array of column names for this Notechart.
  get columns () {
    return this._notechart.columns
  }

  // The player number.
  get number () {
    return this._number
  }

  // An Object representing player options.
  get options () {
    return this._options
  }

}

export default Player
