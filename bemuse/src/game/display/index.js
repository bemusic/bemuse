import './game-display.scss'

import $ from 'jquery'

import PlayerDisplay from './player-display'
import formatTime from '../../utils/formatTime'
import { shouldDisableFullScreen } from 'bemuse/devtools/query-flags'
import screenfull from 'screenfull'

export class GameDisplay {
  constructor({ game, context, backgroundImagePromise, video }) {
    this._game = game
    this._context = context
    const skinData = context.skinData
    this._players = new Map(
      game.players.map((player) => [
        player,
        new PlayerDisplay(player, skinData),
      ])
    )
    this._stateful = {}
    this._wrapper = this._createWrapper({
      backgroundImagePromise,
      video,
      panelPlacement: game.players[0].options.placement,
      infoPanelPosition: skinData.infoPanelPosition,
    })
    this._createTouchEscapeButton()
    this._createFullScreenButton()
    this._escapeHintShown = false
  }

  setEscapeHandler(escapeHandler) {
    this._onEscape = escapeHandler
  }

  setReplayHandler(replayHandler) {
    this._onReplay = replayHandler
  }

  start() {
    this._started = new Date().getTime()
    const player = this._game.players[0]
    const songInfo = player.notechart.songInfo
    const prefix = player.options.autoplayEnabled ? '[AUTOPLAY] ' : ''
    this._stateful['song_title'] = prefix + songInfo.title
    this._stateful['song_artist'] = songInfo.artist
    this._duration = player.notechart.duration
  }

  destroy() {
    this._context.destroy()
  }

  update(gameTime, gameState) {
    const time = (new Date().getTime() - this._started) / 1000
    const data = this._getData(time, gameTime, gameState)
    this._updateStatefulData(time, gameTime, gameState)
    this._context.render(Object.assign({}, this._stateful, data))
    this._synchronizeVideo(gameTime)
    this._synchronizeTutorialEscapeHint(gameTime)
  }

  _synchronizeVideo(gameTime) {
    if (this._video && !this._videoStarted && gameTime >= this._videoOffset) {
      this._video.volume = 0
      this._video.play()
      this._video.classList.add('is-playing')
      this._videoStarted = true
    }
  }

  _synchronizeTutorialEscapeHint(gameTime) {
    if (this._game.options.tutorial) {
      const TUTORIAL_ESCAPE_HINT_SHOW_TIME = 101.123595506
      if (
        gameTime >= TUTORIAL_ESCAPE_HINT_SHOW_TIME &&
        !this._escapeHintShown
      ) {
        this._escapeHintShown = true
        this._escapeHint.classList.add('is-shown')
      }
    }
  }

  _getData(time, gameTime, gameState) {
    const data = {}
    data['tutorial'] = this._game.options.tutorial ? 'yes' : 'no'
    data['t'] = time
    data['gameTime'] = gameTime
    data['ready'] = this._getReady(gameState)
    data['song_time'] = this._getSongTime(gameTime)
    for (const [player, playerDisplay] of this._players) {
      const playerState = gameState.player(player)
      const playerData = playerDisplay.update(time, gameTime, playerState)
      for (const key in playerData) {
        data[`p${player.number}_${key}`] = playerData[key]
      }
    }
    return data
  }

  _updateStatefulData(time, gameTime, gameState) {
    const data = this._stateful
    if (data['started'] === undefined && gameState.started) {
      data['started'] = time
    }
    if (data['gettingStarted'] === undefined && gameState.gettingStarted) {
      data['gettingStarted'] = time
    }
  }

  _getSongTime(gameTime) {
    return (
      formatTime(Math.min(this._duration, Math.max(0, gameTime))) +
      ' / ' +
      formatTime(this._duration)
    )
  }

  _getReady(gameState) {
    const f = gameState.readyFraction
    return f > 0.5 ? Math.pow(1 - (f - 0.5) / 0.5, 2) : 0
  }

  _createWrapper({
    backgroundImagePromise,
    video,
    panelPlacement,
    infoPanelPosition,
  }) {
    const $wrapper = $('<div class="game-display"></div>')
      .attr('data-panel-placement', panelPlacement)
      .attr('data-info-panel-position', infoPanelPosition)
      .append('<div class="game-display--bg js-back-image"></div>')
      .append(this.view)
    if (backgroundImagePromise) {
      Promise.resolve(backgroundImagePromise).then((image) =>
        $wrapper.find('.js-back-image').append(image)
      )
    }
    if (video) {
      this._video = video.element
      this._videoOffset = video.offset
      $(video.element).addClass('game-display--video-bg').appendTo($wrapper)
    }
    return $wrapper[0]
  }

  _createTouchEscapeButton() {
    const touchButtons = document.createElement('div')
    touchButtons.className = 'game-display--touch-buttons is-left'
    this.wrapper.appendChild(touchButtons)
    touchButtons.classList.add('is-visible')
    const addTouchButton = (className, onClick) => {
      const button = createTouchButton(onClick, className)
      touchButtons.appendChild(button)
    }
    addTouchButton('game-display--touch-escape-button', () => this._onEscape())
    addTouchButton('game-display--touch-replay-button', () => this._onReplay())

    const escapeHint = document.createElement('div')
    escapeHint.textContent = 'Click or press Esc to exit the tutorial'
    escapeHint.className = 'game-display--escape-hint'
    this._escapeHint = escapeHint
    touchButtons.appendChild(escapeHint)
  }

  _createFullScreenButton() {
    if (shouldDisableFullScreen() || !screenfull.enabled) {
      return
    }
    const touchButtons = document.createElement('div')
    touchButtons.className = 'game-display--touch-buttons is-visible is-right'
    this.wrapper.appendChild(touchButtons)
    const onClick = () => {
      screenfull.request()
    }
    const button = createTouchButton(
      onClick,
      'game-display--touch-fullscreen-button'
    )
    touchButtons.appendChild(button)
  }

  get context() {
    return this._context
  }

  get view() {
    return this._context.view
  }

  get wrapper() {
    return this._wrapper
  }
}

function createTouchButton(onClick, className) {
  const button = document.createElement('button')
  button.addEventListener(
    'touchstart',
    (e) => {
      e.stopPropagation()
    },
    true
  )
  button.onclick = (e) => {
    e.preventDefault()
    onClick()
  }
  button.className = className
  return button
}

export default GameDisplay
