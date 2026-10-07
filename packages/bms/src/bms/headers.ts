import { ID_INDEXED_COMMAND, normalizeIdSuffix } from '../util/id'

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
  private _base = 36

  constructor() {
    this._data = {}
    this._dataAll = {}
  }

  /**
   * The numeric base used for keysound/event IDs in this chart.
   * Defaults to `36` (case-insensitive IDs); `62` enables case-sensitive IDs.
   */
  get base(): number {
    return this._base
  }

  /**
   * Sets the numeric base for keysound/event IDs.
   *
   * This must be set (by the {Compiler}, from the `#BASE` header) before any
   * ID-indexed headers are stored, so that their keys are normalized
   * consistently with later lookups.
   * @param base the numeric base (`36` or `62`)
   */
  setBase(base: number) {
    this._base = base
  }

  /**
   * Normalizes a header field name into its storage key.
   *
   * The command prefix is always folded to lowercase (case-insensitive),
   * while for ID-indexed commands (`#WAVxx`, `#BMPxx`, `#BPMxx`, `#STOPxx`)
   * the 2-character ID suffix is normalized according to the chart’s base:
   * lowercased in base-36, but case-preserved in base-62.
   */
  private _normalizeName(name: string): string {
    const match = name.match(ID_INDEXED_COMMAND)
    if (match) {
      return match[1].toLowerCase() + normalizeIdSuffix(match[2], this._base)
    }
    return name.toLowerCase()
  }

  /**
   * Iterates through each header field using a callback function.
   * @param callback will be called for each header field
   */
  each(callback: (key: string, value: string) => any) {
    for (const i in this._data) {
      callback(i, this._data[i])
    }
  }

  /**
   * Retrieves the header field’s latest value.
   * @param name field’s name
   * @return the field’s latest value
   */
  get(name: string): string | undefined {
    return this._data[this._normalizeName(name)]
  }

  /**
   * Retrieves the header field’s values.
   * This is useful when a header field is specified multiple times.
   * @param name field’s name
   */
  getAll(name: string): string[] | undefined {
    return this._dataAll[this._normalizeName(name)]
  }

  /**
   * Sets the header field’s value.
   * @param name field’s name
   * @param value field’s value
   */
  set(name: string, value: string) {
    const key = this._normalizeName(name)
    this._data[key] = value
    ;(this._dataAll[key] || (this._dataAll[key] = [])).push(value)
  }
}
