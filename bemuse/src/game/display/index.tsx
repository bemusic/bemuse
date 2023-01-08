import './game-display.scss'

import $ from 'jquery'
import { Context } from 'bemuse/scintillator'
import Game from '../game'
import GameState from '../state'
import { InfoPanelPosition } from 'bemuse/scintillator/skin'
import { LoadImagePromise } from '../loaders/loadImage'
import { PanelPlacement } from 'bemuse/app/entities/Options'
import Player from '../player'
import PlayerDisplay from './player-display'
import React from 'react'
import { createRoot } from 'react-dom/client'
import formatTime from '../../utils/formatTime'
import screenfull from 'screenfull'
import { shouldDisableFullScreen } from 'bemuse/devtools/query-flags'

export interface Video {
  element: HTMLVideoElement
  offset: number
}

export class GameDisplay {
  constructor({
    game,
    context,
    backgroundImagePromise,
    video,
  }: {
    game: Game
    context: Context
    backgroundImagePromise: LoadImagePromise
    video: Video | null
  }) {
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

  private _game: Game
  private _context: Context
  private _players: Map<Player, PlayerDisplay>
  private _stateful: Record<string, string | number>

  private _wrapper: HTMLElement

  private _escapeHintShown: boolean
  private _escapeHint: HTMLDivElement | undefined

  private _onEscape: () => void = () => {}
  private _onReplay: () => void = () => {}

  private _started: number = 0
  private _duration: number = 0

  private _video: HTMLVideoElement | undefined
  private _videoStarted: boolean | undefined
  private _videoOffset: number = 0

  setEscapeHandler(escapeHandler: () => void) {
    this._onEscape = escapeHandler
  }

  setReplayHandler(replayHandler: () => void) {
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

  update(gameTime: number, gameState: GameState) {
    const time = (new Date().getTime() - this._started) / 1000
    const data = this._getData(time, gameTime, gameState)
    this._updateStatefulData(time, gameState)
    this._context.render(Object.assign({}, this._stateful, data))
    this._synchronizeVideo(gameTime)
    this._synchronizeTutorialEscapeHint(gameTime)
  }

  private _synchronizeVideo(gameTime: number) {
    if (this._video && !this._videoStarted && gameTime >= this._videoOffset) {
      this._video.volume = 0
      this._video.play()
      this._video.classList.add('is-playing')
      this._videoStarted = true
    }
  }

  private _synchronizeTutorialEscapeHint(gameTime: number) {
    if (this._game.options.tutorial) {
      const TUTORIAL_ESCAPE_HINT_SHOW_TIME = 101.123595506
      if (
        gameTime >= TUTORIAL_ESCAPE_HINT_SHOW_TIME &&
        !this._escapeHintShown
      ) {
        this._escapeHintShown = true
        this._escapeHint?.classList.add('is-shown')
      }
    }
  }

  private _getData(
    time: number,
    gameTime: number,
    gameState: GameState
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {
      tutorial: this._game.options.tutorial ? 'yes' : 'no',
      t: time,
      gameTime: gameTime,
      ready: this._getReady(gameState),
      song_time: this._getSongTime(gameTime),
    }
    for (const [player, playerDisplay] of this._players) {
      const playerState = gameState.player(player)
      const playerData = playerDisplay.update(time, gameTime, playerState)
      for (const key in playerData) {
        data[`p${player.number}_${key}`] = playerData[key]
      }
    }
    return data
  }

  private _updateStatefulData(time: number, gameState: GameState) {
    const data = this._stateful
    if (data['started'] === undefined && gameState.started) {
      data['started'] = time
    }
    if (data['gettingStarted'] === undefined && gameState.gettingStarted) {
      data['gettingStarted'] = time
    }
  }

  private _getSongTime(gameTime: number) {
    return (
      formatTime(Math.min(this._duration, Math.max(0, gameTime))) +
      ' / ' +
      formatTime(this._duration)
    )
  }

  private _getReady(gameState: GameState) {
    const f = gameState.readyFraction
    return f > 0.5 ? Math.pow(1 - (f - 0.5) / 0.5, 2) : 0
  }

  private _createWrapper({
    backgroundImagePromise,
    video,
    panelPlacement,
    infoPanelPosition,
  }: {
    backgroundImagePromise: LoadImagePromise
    video: Video | null
    panelPlacement: PanelPlacement
    infoPanelPosition: InfoPanelPosition
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

  private _createTouchEscapeButton() {
    const touchButtons = document.createElement('div')
    touchButtons.className = 'game-display--touch-buttons is-left is-visible'
    this.wrapper.appendChild(touchButtons)
    createRoot(touchButtons).render(
      <>
        <TouchButton
          className='game-display--touch-escape-button'
          onClick={() => this._onEscape()}
        />
        <TouchButton
          className='game-display--touch-replay-button'
          onClick={() => this._onReplay()}
        />
        <div className='game-display--escape-hint'>
          Click or press Esc to exit the tutorial
        </div>
      </>
    )
  }

  private _createFullScreenButton() {
    if (shouldDisableFullScreen() || !screenfull.isEnabled) {
      return
    }
    const touchButtons = document.createElement('div')
    touchButtons.className = 'game-display--touch-buttons is-visible is-right'
    this.wrapper.appendChild(touchButtons)
    createRoot(touchButtons).render(
      <TouchButton
        className='game-display--touch-fullscreen-button'
        onClick={() => {
          screenfull.request()
        }}
      />
    )
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

function TouchButton({
  className,
  onClick,
  children,
}: {
  className: string
  onClick: () => void
  children?: ReactNode
}) {
  return (
    <button
      className={className}
      onTouchStartCapture={(e) => {
        e.stopPropagation()
      }}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
    >
      {children}
    </button>
  )
}

export default GameDisplay
