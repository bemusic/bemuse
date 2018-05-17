
var DataStructure = require('data-structure')

// Public: The Segment data structure represents a single speedcore segment.
//
// It has the following properties:
//
// * `t` {Number} representing value of _t_.
// * `x` {Number} representing value of _x_.
// * `dx` {Number} representing amount of _x_ to increase per _t_.
//   Think of it as the velocity.
// * `inclusive` (optional) {Boolean} representing whether or not to include
//   the starting value as part of the segment.
//
// See the {Speedcore} documentation for a more elaborate explanation.
//
/* data Note */
module.exports = new DataStructure({
  t: 'number',
  x: 'number',
  dx: 'number',
})
