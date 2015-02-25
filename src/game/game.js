
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
}

export default Game
