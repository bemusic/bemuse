
var DataStructure = require('data-structure')

// Public: The Note data structure represents a single note in a notechart.
//
// It has the following properties:
//
// * `beat` A {Number} representing the number of beats since the beginning
//   of the notechart
// * `endBeat` A {Number} representing the ending beat in case of a long note,
//   `undefined` otherwise
// * `column` A {String} representing the playable column of the note.
//   `undefined` if it's an unplayable note
// * `keysound` A {String} representing the keysound ID.
//   You may use a {Keysounds} to resolve the keysound ID into filename.
//
/* data Note */
module.exports = new DataStructure({
  beat: 'number',
  endBeat: DataStructure.maybe('number'),
  column: DataStructure.maybe('string'),
  keysound: 'string',
})
