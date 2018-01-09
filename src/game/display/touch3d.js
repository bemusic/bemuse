// Touch3D mode -- inspired by Thapster.
// Notes are arranged on a 3D arc that moves towards the screen.
// Example: https://twitter.com/bemusegame/status/950505986409709569

/** Parameters to the algorithm. These values are obtained by trial-and-error. */
const config = {
  /** Centre point of the arc (X-coordinate) */
  cx: 1024,
  /** Centre point of the arc (Y-coordinate) */
  cy: -975,
  /** Radius of the arc */
  r: 1024,
  /** Beginning angle of the arc */
  t0: 3.922,
  /** Ending angle of the arc */
  t1: 4.555,
  /**
   * Perspective value (field of view).
   * Camera is placed at (p, 0, 0), facing towards (0, 0, 0).
   * See: https://developer.mozilla.org/en-US/docs/Web/CSS/perspective
   */
  p: 960,
  /** Width of the play area */
  w: 60
}

/**
 * Given the display position (0 representing top and 1 representing bottom),
 * calculates the onscreen position to display it.
 *
 * Screen size is hardcoded as 1280x720.
 *
 * @param position The display position (0 representing top and 1 representing bottom)
 * @return An object with
 *   - `y` A number represeting the onscreen position to display the note.
 *   - `projection` The projected scale. If an object is closer to the screen,
 *     it will appear bigger. This value represents that scale.
 */
export function getRow (position) {
  let excess = Math.max(0, position - 1)
  if (position < 0) position = 0
  if (position > 1) position = 1
  let theta = config.t0 + (config.t1 - config.t0) * position
  let pointX = config.cx + Math.cos(theta) * config.r
  let pointY = config.cy - Math.sin(theta) * config.r
  let projection = config.p / (config.p - pointX)
  let screenY = pointY * projection + 720 / 2
  return { y: screenY + excess * 2048, projection }
}

/**
 * The world width of the play area.
 * Multiply this with the projection number to get the onscreen width.
 */
export const PLAY_AREA_WIDTH = config.w

/**
 * Finds the touched column based on screen coordinate.
 *
 * @param {number} x The x onscreen coordinate (0~1280)
 * @param {number} y The y onscreen coordinate (0~1280)
 * @return Column name ('1'~'7') or `null` if no column should be triggered.
 */
export function getTouchedColumn (x, y) {
  let min = 0.75
  let max = 1
  let mid
  let row
  for (let i = 0; i < 8; i++) {
    mid = (min + max) / 2
    row = getRow(mid)
    if (row.y > y) {
      max = mid
    } else {
      min = mid
    }
  }
  if (mid < 0.8) return null
  let x0 = 1280 / 2 + row.projection * -config.w
  let x1 = 1280 / 2 + row.projection * config.w
  let pos = Math.floor((x - x0) / (x1 - x0) * 7)
  if (pos >= -1 && pos <= 7) {
    if (pos < 0) pos = 0
    if (pos > 6) pos = 6
    return String(pos + 1)
  }
  return null
}
