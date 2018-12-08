// Public: A module that exposes {Keysounds}
/* module */

import { uniq, values } from '../util/lodash'
import { BMSChart } from '../bms/chart'

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
  constructor(map) {
    /** @type {{[id: string]: string}} */
    this._map = map
  }

  /**
   * Returns the keysound file at the specified ID.
   * @param {string} id the two-character keysound ID
   * @returns {string | undefined} the sound filename
   */
  get(id) {
    return this._map[id.toLowerCase()]
  }

  /**
   * Returns an array of unique filenames in this Keysounds object.
   * @returns {string[]} filenames array
   */
  files() {
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
   * @param {BMSChart} chart
   */
  static fromBMSChart(chart) {
    void BMSChart
    var map = {}
    chart.headers.each(function(name, value) {
      var match = name.match(/^wav(\S\S)$/i)
      if (!match) return
      map[match[1].toLowerCase()] = value
    })
    return new Keysounds(map)
  }
}
