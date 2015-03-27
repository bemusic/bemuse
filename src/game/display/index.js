
import PlayerDisplay from './player-display'

export class GameDisplay {
  constructor({ game, skin, context }) {
    this._context = context
    this._players = new Map(game.players.map(player =>
        [player, new PlayerDisplay(player)]))
  }
  start() {
    this._started = new Date().getTime()
  }
  update(gameTime, gameState) {
    let time = (new Date().getTime() - this._started) / 1000
    let data = { }
    data.t        = time
    data.gameTime = gameTime
    for (let [player, playerDisplay] of this._players) {
      let playerState = gameState.player(player)
      let playerData = playerDisplay.update(time, gameTime, playerState)
      for (let key in playerData) {
        data[`p${player.number}_${key}`] = playerData[key]
      }
    }
    this._context.render(data)
  }
  get context() {
    return this._context
  }
  get view() {
    return this._context.view
  }
}

export default GameDisplay
