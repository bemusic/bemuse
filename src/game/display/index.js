
import PlayerDisplay from './player-display'

export class GameDisplay {
  constructor({ game, skin, context }) {
    this._game      = game
    this._context   = context
    this._players   = new Map(game.players.map(player =>
        [player, new PlayerDisplay(player)]))
    this._stateful  = { }
    void skin
  }
  start() {
    this._started = new Date().getTime()
    let player    = this._game.players[0]
    let songInfo  = player.notechart.songInfo
    this._stateful['song_title']  = songInfo.title
    this._stateful['song_artist'] = songInfo.artist
    this._duration = player.notechart.duration
  }
  destroy() {
    this._context.destroy()
  }
  update(gameTime, gameState) {
    let time = (new Date().getTime() - this._started) / 1000
    let data = this._getData(time, gameTime, gameState)
    if (this._stateful.started === undefined) {
      if (gameState.started) this._stateful.started = time
    }
    this._context.render(Object.assign({ }, this._stateful, data))
  }
  _getData(time, gameTime, gameState) {
    let data = { }
    data['tutorial']  = this._game.options.tutorial ? 'yes' : 'no'
    data['t']         = time
    data['gameTime']  = gameTime
    data['ready']     = this._getReady(gameState)
    data['song_time'] = this._getSongTime(gameTime)
    for (let [player, playerDisplay] of this._players) {
      let playerState = gameState.player(player)
      let playerData = playerDisplay.update(time, gameTime, playerState)
      for (let key in playerData) {
        data[`p${player.number}_${key}`] = playerData[key]
      }
    }
    return data
  }
  _getSongTime(gameTime) {
    return (
        this._formatTime(Math.min(this._duration, Math.max(0, gameTime))) +
        ' / ' + this._formatTime(this._duration))
  }
  _getReady(gameState) {
    let f = gameState.readyFraction
    return f > 0.5 ? Math.pow(1 - (f - 0.5) / 0.5, 2) : 0
  }
  get context() {
    return this._context
  }
  get view() {
    return this._context.view
  }
  _formatTime(seconds) {
    let s = Math.floor(seconds % 60)
    return Math.floor(seconds / 60) + ':' + (s < 10 ? '0' : '') + s
  }
}

export default GameDisplay
