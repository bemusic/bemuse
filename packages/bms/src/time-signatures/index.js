/**
 * A TimeSignatures is a collection of time signature values
 * index by measure number.
 *
 * The measure number starts from 0.
 * By default, each measure has a measure size of 1
 * (which represents the common 4/4 time signature)
 *
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #00102:0.75
 * #00103:1.25
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can access the {TimeSignatures} object:
 *
 * ```js
 * var timeSignatures = bmsChart.timeSignatures
 * ```
 *
 * Note that you can also use the constructor
 * to create a {TimeSignatures} from scratch.
 *
 * One of the most useful use case of this class
 * is to convert the measure and fraction into beat number.
 *
 * ```js
 * timeSignatures.measureToBeat(0, 0.000) // =>  0.0
 * timeSignatures.measureToBeat(0, 0.500) // =>  2.0
 * timeSignatures.measureToBeat(1, 0.000) // =>  4.0
 * timeSignatures.measureToBeat(1, 0.500) // =>  5.5
 * timeSignatures.measureToBeat(2, 0.000) // =>  7.0
 * timeSignatures.measureToBeat(2, 0.500) // =>  9.5
 * timeSignatures.measureToBeat(3, 0.000) // => 12.0
 * ```
 */
export class TimeSignatures {
  constructor () {
    this._values = {}
  }

  /**
   * Sets the size of a specified measure.
   * @param {number} measure the measure number, starting from 0
   * @param {number} value the measure size.
   *  For example, a size of 1.0 represents a common 4/4 time signature,
   *  whereas a size of 0.75 represents the 3/4 or 6/8 time signature.
   */
  set (measure, value) {
    this._values[measure] = value
  }

  /**
   * Retrieves the size of a specified measure.
   * @param {number} measure representing the measure number.
   * @returns {number} the size of the measure.
   *  By default, a measure has a size of 1.
   */
  get (measure) {
    return this._values[measure] || 1
  }

  /**
   * Retrieves the number of beats in a specified measure.
   *
   * Since one beat is equivalent to a quarter note in 4/4 time signature,
   * this is equivalent to `(timeSignatures.get(measure) * 4)`.
   * @param {number} measure representing the measure number.
   * @returns {number} the size of the measure in beats.
   */
  getBeats (measure) {
    return this.get(measure) * 4
  }

  /**
   * Converts a measure number and a fraction inside that measure
   * into the beat number.
   *
   * @param {number} measure the measure number.
   * @param {number} fraction the fraction of a measure,
   * @returns the number of beats since measure 0.
   */
  measureToBeat (measure, fraction) {
    var sum = 0
    for (var i = 0; i < measure; i++) sum += this.getBeats(i)
    return sum + this.getBeats(measure) * fraction
  }
}
