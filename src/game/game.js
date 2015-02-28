
import Notechart  from './notechart'
import Player     from './player'

// The Game model
export class Game {
  constructor(chart, options) {
    this.players = options.players.map(function(playerOptions, index) {
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
