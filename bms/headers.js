
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
  this._dataAll = { }
}

/**
 * Invokes a function at each header.
 *
 * @method each
 * @param  {Function} callback function to be invoked
 * @return {BMSHeaders} self
 */
BMSHeaders.prototype.each = function(callback) {
  for (var i in this._data) {
    callback(i, this._data[i])
  }
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
 * Retrieves all headers (when header is specified multiple times).
 *
 * @method get
 * @param  {String} name The header name (case-insensitive)
 * @return {String[]} The values of specified header
 */
BMSHeaders.prototype.getAll = function(name) {
  return this._dataAll[name.toLowerCase()]
}

/**
 * Sets the header.
 *
 * @method set
 * @param  {String} name The header name (case-insensitive)
 * @param  {String} value The value to set
 */
BMSHeaders.prototype.set = function(name, value) {
  var key = name.toLowerCase()
  this._data[key] = value
  ;(this._dataAll[key] || (this._dataAll[key] = [])).push(value)
}

