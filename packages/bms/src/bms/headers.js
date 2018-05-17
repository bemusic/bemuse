// Public: A module that exposes {BMSHeaders}.
/* module */
// Public: A BMSHeader holds the header information in a BMS file, such as
// `#TITLE`, `#ARTIST`, or `#BPM`.
//
// You get retrieve a header using the `get()` method:
//
// ```js
// chart.headers.get('title')
// ```
//
// For some header fields that may contain multiple values, such as `#SUBTITLE`,
// you can get them all using `getAll()`:
//
// ```js
// chart.headers.getAll()
// ```
/* class BMSHeaders */
// Public: Constructs an empty BMSHeader
// Public: A module that exposes {BMSHeaders}.
/* module */
// Public: A BMSHeader holds the header information in a BMS file, such as
// `#TITLE`, `#ARTIST`, or `#BPM`.
//
// You get retrieve a header using the `get()` method:
//
// ```js
// chart.headers.get('title')
// ```
//
// For some header fields that may contain multiple values, such as `#SUBTITLE`,
// you can get them all using `getAll()`:
//
// ```js
// chart.headers.getAll()
// ```
/* class BMSHeaders */
// Public: Constructs an empty BMSHeader
export class BMSHeaders {
  constructor () {
    this._data = {}
    this._dataAll = {}
  }
  // Public: Iterates through each header field using a callback function.
  //
  // * `callback` A {Function} that will be called for each header field
  //   * `key` {String} representing the field’s name
  //   * `value` {String} representing the field’s value
  //
  each (callback) {
    for (var i in this._data) {
      callback(i, this._data[i])
    }
  }
  // Public: Retrieves the header field’s latest value.
  //
  // * `name` A {String} representing field’s name
  //
  // Returns a {String} representing the field’s value
  //
  get (name) {
    return this._data[name.toLowerCase()]
  }
  // Public: Retrieves the header field’s value. This is useful when a header
  // field is specified multiple times.
  //
  // * `name` A {String} representing field’s name
  //
  // Returns an {Array} of {String} values
  //
  getAll (name) {
    return this._dataAll[name.toLowerCase()]
  }
  // Public: Sets the header field’s value.
  //
  // * `name` A {String} representing field’s name
  // * `value` A {String} representing field’s value
  //
  set (name, value) {
    var key = name.toLowerCase()
    this._data[key] = value
    ;(this._dataAll[key] || (this._dataAll[key] = [])).push(value)
  }
}
