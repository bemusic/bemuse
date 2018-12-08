/**
 * A BMSHeader holds the header information in a BMS file, such as
 * `#TITLE`, `#ARTIST`, or `#BPM`.
 *
 * You get retrieve a header using the `get()` method:
 *
 * ```js
 * chart.headers.get('title')
 * ```
 *
 * For some header fields that may contain multiple values, such as `#SUBTITLE`,
 * you can get them all using `getAll()`:
 *
 * ```js
 * chart.headers.getAll()
 * ```
 */
export class BMSHeaders {
  constructor() {
    this._data = {}
    this._dataAll = {}
  }

  /**
   * Iterates through each header field using a callback function.
   * @param {(key: string, value: string) => any} callback will be called for each header field
   */
  each(callback) {
    for (var i in this._data) {
      callback(i, this._data[i])
    }
  }

  /**
   * Retrieves the header field’s latest value.
   * @param {string} name field’s name
   * @return {string | undefined} the field’s latest value
   */
  get(name) {
    return this._data[name.toLowerCase()]
  }

  /**
   * Retrieves the header field’s values.
   * This is useful when a header field is specified multiple times.
   * @param {string} name field’s name
   * @return {string[] | undefined}
   */
  getAll(name) {
    return this._dataAll[name.toLowerCase()]
  }

  /**
   * Sets the header field’s value.
   * @param {string} name field’s name
   * @param {string} value field’s value
   */
  set(name, value) {
    var key = name.toLowerCase()
    this._data[key] = value
    ;(this._dataAll[key] || (this._dataAll[key] = [])).push(value)
  }
}
