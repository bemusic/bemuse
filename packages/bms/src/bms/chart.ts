import { BMSHeaders } from './headers'
import { BMSObjects } from './objects'
import { TimeSignatures } from '../time-signatures'

/**
 * A BMSChart holds information about a particular BMS notechart.
 * Note that a BMSChart does not contain any information about `#RANDOM`,
 * as they are already processed after compilation.
 *
 * There is not many useful things you can do with a BMSChart other than
 * accessing the header fields and objects inside it.
 *
 * To extract information from a BMSChart,
 * please look at the documentation of higher-level classes,
 * such as {Keysounds}, {Notes}, and {Timing}.
 */
export class BMSChart {
  headers: BMSHeaders
  objects: BMSObjects
  timeSignatures: TimeSignatures
  constructor() {
    /**
     * {BMSHeaders} representing the BMS-specific headers of this notechart
     */
    this.headers = new BMSHeaders()
    /**
     * {BMSObjects} representing all objects of this notechart
     */
    this.objects = new BMSObjects()
    /**
     * {TimeSignatures} representing the time signature information in this chart
     */
    this.timeSignatures = new TimeSignatures()
  }

  /**
   * Public: Converts measure number and fraction into beat.
   * A single beat is equivalent to a quarter note in common time signature.
   *
   * @param {number} measure representing the measure number, starting from 0
   * @param {number} fraction representing the fraction inside that measure, from 0 to 1
   */
  measureToBeat(measure: number, fraction: number) {
    return this.timeSignatures.measureToBeat(measure, fraction)
  }
}
