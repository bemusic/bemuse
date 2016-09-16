
import PlayerDisplay from './player-display'
import './game-display.scss'
import $ from 'jquery'

export class GameDisplay {
  constructor ({ game, context, backgroundImagePromise, video }) {
    this._game      = game
    this._context   = context
    this._players   = new Map(game.players.map(player =>
        [player, new PlayerDisplay(player)]))
    this._stateful  = { }
    this._wrapper   = this._createWrapper({
      backgroundImagePromise,
      video,
      panelPlacement: game.players[0].options.placement
    })
  }
  start () {
    this._started = new Date().getTime()
    let player    = this._game.players[0]
    let songInfo  = player.notechart.songInfo
    this._stateful['song_title']  = songInfo.title
    this._stateful['song_artist'] = songInfo.artist
    this._duration = player.notechart.duration
  }
  destroy () {
    this._context.destroy()
  }
  update (gameTime, gameState) {
    let time = (new Date().getTime() - this._started) / 1000
    let data = this._getData(time, gameTime, gameState)
    this._updateStatefulData(time, gameTime, gameState)
    this._context.render(Object.assign({ }, this._stateful, data))
    if (this._video && !this._videoStarted && gameTime >= this._videoOffset) {
      this._video.volume = 0
      this._video.play()
      this._video.classList.add('is-playing')
      this._videoStarted = true
    }
  }
  _getData (time, gameTime, gameState) {
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
  _updateStatefulData (time, gameTime, gameState) {
    let data = this._stateful
    if (data['started'] === undefined && gameState.started) {
      data['started'] = time
    }
    if (data['gettingStarted'] === undefined && gameState.gettingStarted) {
      data['gettingStarted'] = time
    }
  }
  _getSongTime (gameTime) {
    return (
        this._formatTime(Math.min(this._duration, Math.max(0, gameTime))) +
        ' / ' + this._formatTime(this._duration))
  }
  _getReady (gameState) {
    let f = gameState.readyFraction
    return f > 0.5 ? Math.pow(1 - (f - 0.5) / 0.5, 2) : 0
  }
  _createWrapper ({ backgroundImagePromise, video, panelPlacement }) {
    var $wrapper = $('<div class="game-display"></div>')
      .attr('data-panel-placement', panelPlacement)
      .append('<div class="game-display--bg js-back-image"></div>')
      .append(this.view)
    if (backgroundImagePromise) {
      Promise.resolve(backgroundImagePromise).then(
        image => $wrapper.find('.js-back-image').append(image)
      )
    }
    if (video) {
      this._video = video.element
      this._videoOffset = video.offset
      $(video.element).addClass('game-display--video-bg').appendTo($wrapper)
    }
    return $wrapper[0]
  }
  get context () {
    return this._context
  }
  get view () {
    return this._context.view
  }
  get wrapper () {
    return this._wrapper
  }
  _formatTime (seconds) {
    let s = Math.floor(seconds % 60)
    return Math.floor(seconds / 60) + ':' + (s < 10 ? '0' : '') + s
  }
}

export default GameDisplay
