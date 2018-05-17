
// Public: A module that exposes {BMSObjects}.
/* module */

module.exports = BMSObjects

// Public: A BMSObjects holds a collection of objects inside a BMS notechart.
/* class BMSObjects */

// Public: Constructs an empty BMSObjects.
function BMSObjects () {
  this._objects = []
}

// Public: Adds a new object to this collection.
//
// If an object already exists on the same channel and position,
// the object is replaced (except for autokeysound tracks).
//
// * `object` {BMSObject} to add
//
BMSObjects.prototype.add = function (object) {
  if (object.channel !== '01') {
    for (var i = 0; i < this._objects.length; i++) {
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

// Public: Returns an array of all objects.
//
// Returns an {Array} of {BMSObject} objects
//
BMSObjects.prototype.all = function () {
  return this._objects.slice()
}

// Public: Returns a sorted array of all objects.
//
// Returns an {Array} of {BMSObject} objects
//
BMSObjects.prototype.allSorted = function () {
  var list = this.all()
  list.sort(function (a, b) {
    return (a.measure + a.fraction) - (b.measure + b.fraction)
  })
  return list
}

// Public: A BMSObject data structure represents an object inside a {BMSChart}.
//
// It is a plain object with the following fields:
//
// * `channel` A {String} representing the raw two-character BMS channel of this object
// * `measure` A {Number} representing the measure number, starting at 0 (corresponds to `#000`)
// * `fraction` A {Number} representing the fractional position inside the measure,
//   ranging from 0 (inclusive) to 1 (exclusive).
//   0 means that the object is at the start of the measure,
//   whereas 1 means that the object is at the end of the measure.
// * `value` A {String} representing the raw value of the BMS object.
//
/* data BMSObject */
