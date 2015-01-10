
/**
 * @module bms/objects
 */
module.exports = BMSObjects

/**
 * Holds a collection of objects inside a BMS notechart.
 *
 * @class BMSObjects
 * @constructor
 */
function BMSObjects() {
  this._objects = []
}

/**
 * Adds a new object to the collection. If an object already exists on the
 * same channel and position, the object is replaced (except for autokeysound
 * tracks).
 *
 * @method add
 * @param {BMSObject} object
 */
BMSObjects.prototype.add = function(object) {
  if (object.channel !== '01') {
    for (var i = 0; i < this._objects.length; i ++) {
      var test = this._objects[i]
      if (test.channel === object.channel &&
          test.measure === object.measure &&
          test.fraction === object.fraction) {
        this._objects[i] = object
        return
      }
    }
  }
  this._objects.push(object)
}

/**
 * Returns a list of all objects.
 *
 * @method all
 * @return {BMSObject[]}
 */
BMSObjects.prototype.all = function() {
  return this._objects.slice()
}

/**
 * Returns a sorted list of all objects.
 *
 * @method all
 * @return {BMSObject[]}
 */
BMSObjects.prototype.allSorted = function() {
  var list = this.all()
  list.sort(function(a, b) {
    return (a.measure + a.fraction) - (b.measure + b.fraction)
  })
  return list
}


/**
 * @class BMSObject
 */
/**
 * The raw two-character BMS channel of this object.
 *
 * @property channel
 * @type String
 */
/**
 * The measure number, starting at 0 (corresponds to `#000`)
 *
 * @property measure
 * @type Number
 */
/**
 * The fractional position inside the measure, ranging from 0 (inclusive)
 * to 1 (exclusive). 0 means that the object is at the start of the measure,
 * where 1 means that the object is at the end of the measure.
 *
 * @property fraction
 * @type Number
 */
/**
 * The raw value of the BMS object — a two-character string.
 *
 * @property value
 * @type String
 */
