let _enabled = false

let _lifecycleHandler = {
  /** @returns {Promise<void>} */
  pauseAt(t) {
    throw new Error('Cannot pause: No lifecycle handler registered!')
  },
  /** @returns {void} */
  unpause() {
    throw new Error('Cannot unpause: No lifecycle handler registered!')
  },
  /** @returns {number} */
  getScore() {
    throw new Error('Cannot get score: No lifecycle handler registered!')
  },
}

/**
 * Activates the test mode. In this mode,
 *
 * - An overlay will be displayed indicating the test mode.
 * - The following APIs will be available to facilitate automated testing:
 *     - `BemuseTestMode.pauseAt(t)` will make the game pause at time `t`.
 *     - `BemuseTestMode.unpause()` will unpause the game.
 * - Score submission is disabled.
 *
 * Note: Once test mode is activated, it cannot be deactivated for the rest of the game session.
 */
export function enableTestMode() {
  if (!_enabled) {
    _enabled = true
    console.log('[Bemuse test mode enabled]')
    const overlay = document.createElement('div')
    overlay.setAttribute(
      'style',
      `
        position: fixed;
        top: 20px;
        left: 20px;
        font: 20px Comic Sans MS, sans-serif;
        z-index: 99999;
        background: rgba(0,0,0,0.5);
        color: #0f0;
        border: 2px solid #0f0;
        padding: 4px;
        pointer-events: none;
      `
    )
    overlay.innerHTML = `
      <strong>Test mode:</strong>
      Bemuse is being controlled by automated test software.
    `
    document.body.appendChild(overlay)
  }
}

/**
 * Registers a pause handler.
 * This allows the `pauseAt` and `unpause` APIs to be used.
 *
 * @param {typeof _lifecycleHandler} handler
 */
export function setGameLifecycleHandler(handler) {
  console.log('[Bemuse test mode] A pause handler has been registered.')
  _lifecycleHandler = handler
}

/**
 * Returns `true` if test mode is enabled, `false` otherwise.
 */
export function isTestModeEnabled() {
  return !!_enabled
}

/**
 * Will schedule the game to pause at time `t`.
 *
 * @param {number} t The song time to pause in seconds
 * @returns {Promise<void>} A promise that will be resolved when the time is reached and game is paused.
 */
export function pauseAt(t) {
  return _lifecycleHandler.pauseAt(t)
}

/**
 * Unpauses the game.
 */
export function unpause() {
  return _lifecycleHandler.unpause()
}

/**
 * Returns the current score.
 */
export function getScore() {
  return _lifecycleHandler.getScore()
}
