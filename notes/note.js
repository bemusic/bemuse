
var DataStructure = require('data-structure')


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
   * @property endBeat
   * @type Number|undefined
   */
  endBeat: DataStructure.maybe(Number),

  /**
   * @property column
   * @type String|undefined
   */
  column: DataStructure.maybe(String),

  /**
   * @property keysound
   * @type String
   */
  keysound: String,

})
