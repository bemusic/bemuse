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
  private _data: { [field: string]: string }
  private _dataAll: { [field: string]: string[] }

  constructor() {
    this._data = {}
    this._dataAll = {}
  }

  /**
   * Iterates through each header field using a callback function.
   * @param callback will be called for each header field
   */
  each(callback: (key: string, value: string) => any) {
    for (var i in this._data) {
      callback(i, this._data[i])
    }
  }

  /**
   * Retrieves the header field’s latest value.
   * @param name field’s name
   * @return the field’s latest value
   */
  get(name: string): string | undefined {
    return this._data[name.toLowerCase()]
  }

  /**
   * Retrieves the header field’s values.
   * This is useful when a header field is specified multiple times.
   * @param name field’s name
   */
  getAll(name: string): string[] | undefined {
    return this._dataAll[name.toLowerCase()]
  }

  /**
   * Sets the header field’s value.
   * @param name field’s name
   * @param value field’s value
   */
  set(name: string, value: string) {
    var key = name.toLowerCase()
    this._data[key] = value
    ;(this._dataAll[key] || (this._dataAll[key] = [])).push(value)
  }
}
