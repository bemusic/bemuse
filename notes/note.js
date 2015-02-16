
var DataStructure = require('data-structure')

var Column = new DataStructure({
  column: String,
})

/**
 * @class Note
 */
module.exports = new DataStructure({

  /**
   * @property beat
   * @type Number
   */
  beat: Number,

  /**
   * @property column
   * @type Column|undefined
   */
  column: DataStructure.maybe(Column),

  /**
   * @property keysound
   * @type String
   */
  keysound: String,

})
