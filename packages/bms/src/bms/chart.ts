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
 * such as {@link Keysounds}, {@link Notes}, and {@link Timing}.
 *
 * @public
 */
export class BMSChart {
  /**
   * BMS-specific headers of this notechart
   */
  headers: BMSHeaders
  /**
   * All objects of this notechart
   */
  objects: BMSObjects
  /**
   * The time signature information in this chart
   */
  timeSignatures: TimeSignatures
  constructor() {
    this.headers = new BMSHeaders()
    this.objects = new BMSObjects()
    this.timeSignatures = new TimeSignatures()
  }

  /**
   * Converts measure number and fraction into beat.
   * A single beat is equivalent to a quarter note in common time signature.
   *
   * @param measure - the measure number, starting from 0
   * @param fraction - the fraction inside that measure, from 0 to 1
   */
  measureToBeat(measure: number, fraction: number) {
    return this.timeSignatures.measureToBeat(measure, fraction)
  }
}
