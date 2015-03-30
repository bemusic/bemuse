
import Notechart  from './notechart'
import Player     from './player'

// The Game model holds the game's options and the player objects.
// This class represents all the data needed to start a game.
// However, it is immutable.  See :js:class:`GameState` for mutable stuff.
export class Game {
  constructor(chart, options) {

    // The Game's options
    this.options = options

    // The Game's players
    this.players = options.players.map(function(playerOptions, index) {
      playerOptions = Object.assign({ }, playerOptions, {
        autosound: options.audioInputLatency >= 0.01
      })
      let notechart = Notechart.fromBMSChart(chart, index + 1, playerOptions)
      return new Player(notechart, index + 1, playerOptions)
    })

  }

  // Returns a list of all sound samples used in game.
  // Used for loading sounds.
  get samples() {
    let set = new Set()
    for (let player of this.players) {
      for (let sample of player.notechart.samples) {
        set.add(sample)
      }
    }
    return Array.from(set)
  }
}

export default Game
