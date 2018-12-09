/**
 * BMSObjects holds a collection of objects inside a BMS notechart.
 */
export class BMSObjects {
  private _objects: BMSObject[]

  constructor() {
    this._objects = []
  }

  /**
   * Adds a new object to this collection.
   * If an object already exists on the same channel and position,
   * the object is replaced (except for autokeysound tracks).
   * @param object the object to add
   */
  add(object: BMSObject) {
    if (object.channel !== '01') {
      for (var i = 0; i < this._objects.length; i++) {
        var test = this._objects[i]
        if (
          test.channel === object.channel &&
          test.measure === object.measure &&
          test.fraction === object.fraction
        ) {
          this._objects[i] = object
          return
        }
      }
    }
    this._objects.push(object)
  }

  /**
   * Returns an array of all objects.
   */
  all() {
    return this._objects.slice()
  }

  /**
   * Returns a sorted array of all objects.
   */
  allSorted() {
    var list = this.all()
    list.sort(function(a, b) {
      return a.measure + a.fraction - (b.measure + b.fraction)
    })
    return list
  }
}

/** An object inside a {BMSChart}. */
export interface BMSObject {
  /** the raw two-character BMS channel of this object */
  channel: string

  /** the measure number, starting at 0 (corresponds to `#000`) */
  measure: number

  /**
   * the fractional position inside the measure,
   * ranging from 0 (inclusive) to 1 (exclusive).
   * 0 means that the object is at the start of the measure,
   * whereas 1 means that the object is at the end of the measure.
   */
  fraction: number

  /** the raw value of the BMS object. */
  value: string
}
