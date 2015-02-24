
import PlayerDisplay from './player-display'

export class GameDisplay {
  constructor({ game, skin, context }) {
    this._context = context
    this._data    = { }
    this._players = new Map(game.players.map(player =>
      [player, new PlayerDisplay(player)]))
    console.log(this._players)
  }
  start() {
    this._started = new Date().getTime()
  }
  update() {
    this._data.t = (new Date().getTime() - this._started) / 1000
    this._context.render(this._data)
  }
  get view() {
    return this._context.view
  }
}

export default GameDisplay
