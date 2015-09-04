
var DataStructure = require('data-structure')


/**
 * @class Note
 */
module.exports = new DataStructure({

  /**
   * @property beat
   * @type Number
   */
  beat: 'number',

  /**
   * @property endBeat
   * @type Number|undefined
   */
  endBeat: DataStructure.maybe('number'),

  /**
   * @property column
   * @type String|undefined
   */
  column: DataStructure.maybe('string'),

  /**
   * @property keysound
   * @type String
   */
  keysound: 'string',

})
