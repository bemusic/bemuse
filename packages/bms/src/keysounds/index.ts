// Public: A module that exposes {Keysounds}
/* module */

import { uniq, values } from '../util/lodash'
import { BMSChart } from '../bms/chart'
import { normalizeIdSuffix } from '../util/id'

/**
 * A simple mapping between keysounds ID and the file name.
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #WAVAA cat.wav
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can create a {Keysounds} using `fromBMSChart()`:
 *
 * ```js
 * var keysounds = Keysounds.fromBMSChart(bmsChart)
 * ```
 *
 * Then you can retrieve the filename using `.get()`:
 *
 * ```js
 * keysounds.get('aa') // => 'cat.wav'
 * ```
 */
export class Keysounds {
  _map: { [id: string]: string }
  _base: number
  /**
   * @param map a mapping from (normalized) keysound ID to filename
   * @param base the chart’s numeric base (36 by default, 62 for case-sensitive
   *   IDs). This governs how IDs passed to {get} are normalized.
   */
  constructor(map: { [id: string]: string }, base = 36) {
    this._map = map
    this._base = base
  }

  /**
   * Returns the keysound file at the specified ID.
   * @param id the two-character keysound ID
   * @returns the sound filename
   */
  get(id: string): string | undefined {
    return this._map[normalizeIdSuffix(id, this._base)]
  }

  /**
   * Returns an array of unique filenames in this Keysounds object.
   * @returns filenames array
   */
  files(): string[] {
    return uniq(values(this._map))
  }

  /**
   * Returns a mapping from keysound ID to keysound filename.
   *
   * **Warning:** This method returns the internal data structure used
   * in this Keysounds object. Do not mutate!
   */
  all() {
    return this._map
  }

  /**
   * Constructs a new {Keysounds} object from a {BMSChart}.
   * @param chart
   */
  static fromBMSChart(chart: BMSChart) {
    void BMSChart
    const base = chart.base
    const map: { [id: string]: string } = {}
    chart.headers.each(function (name, value) {
      const match = name.match(/^wav(\S\S)$/i)
      if (!match) return
      map[normalizeIdSuffix(match[1], base)] = value
    })
    return new Keysounds(map, base)
  }
}
