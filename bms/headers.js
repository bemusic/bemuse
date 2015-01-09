
/**
 * @module bms/headers
 */
module.exports = BMSHeaders

/**
 * @class BMSHeaders
 * @constructor
 */
function BMSHeaders() {
  this._data = { }
}

/**
 * Retrieves the header.
 *
 * @method get
 * @param  {String} name The header name (case-insensitive)
 * @return {String} The value of specified header
 */
BMSHeaders.prototype.get = function(name) {
  return this._data[name.toLowerCase()]
}

/**
 * Sets the header.
 *
 * @method set
 * @param  {String} name The header name (case-insensitive)
 * @param  {String} value The value to set
 */
BMSHeaders.prototype.set = function(name, value) {
  this._data[name.toLowerCase()] = value
}

