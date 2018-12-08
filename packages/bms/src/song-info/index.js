import { match } from '../util/match'
import { assign } from '../util/lodash'
import { BMSChart } from '../bms/chart'

/**
 * A SongInfo represents the song info, such as title, artist, genre.
 *
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #TITLE Exargon [HYPER]
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can create a {SongInfo} using `fromBMSChart()`:
 *
 * ```js
 * var info = SongInfo.fromBMSChart(bmsChart)
 * ```
 *
 * Then you can query the song information by accessing its properties.
 *
 * ```js
 * info.title     // => 'Exargon'
 * info.subtitles // => ['HYPER']
 * ```
 */
export class SongInfo {
  /**
   * Constructs a SongInfo with given data
   * @param {{ [propertyName: string]: any }} info the properties to set on this new instance
   */
  constructor(info) {
    /** the song title */
    this.title = 'NO TITLE'
    /** the song artist */
    this.artist = 'NO ARTIST'
    /** the song genre */
    this.genre = 'NO GENRE'
    /**
     * the song's subtitles, one line per element.
     * The subtitle may be used to represent the difficulty name,
     * such as NORMAL, HYPER, ANOTHER.
     * @type {string[]}
     */
    this.subtitles = []
    /**
     * the song's other artists, one artist per element.
     * @type {string[]}
     */
    this.subartists = []
    /**
     * the difficulty.
     * Meaning of the number is same as BMS's [`#DIFFICULTY`](http:*hitkey.nekokan.dyndns.info/cmds.htm#DIFFICULTY) header.
     *
     * | difficulty | meaning  |
     * | ----------:|:--------:|
     * |          1 | BEGINNER |
     * |          2 | NORMAL   |
     * |          3 | HYPER    |
     * |          4 | ANOTHER  |
     * |          5 | INSANE   |
     */
    this.difficulty = 0
    /**
     * the level of the song.
     * When converted from a BMS chart, this is the value of `#PLAYLEVEL` header.
     */
    this.level = 0
    if (info) assign(this, info)
  }

  /**
   * Constructs a new {SongInfo} object from a {BMSChart}.
   * @param {BMSChart} chart A {BMSChart} to construct a {SongInfo} from
   */
  static fromBMSChart(chart) {
    void BMSChart
    var info = {}
    var title = chart.headers.get('title')
    var artist = chart.headers.get('artist')
    var genre = chart.headers.get('genre')
    var difficulty = +chart.headers.get('difficulty')
    var level = +chart.headers.get('playlevel')
    var subtitles = chart.headers.getAll('subtitle')
    var subartists = chart.headers.getAll('subartist')
    if (typeof title === 'string' && !subtitles) {
      var extractSubtitle = function(m) {
        title = m[1]
        subtitles = [m[2]]
      }
      match(title)
        .when(/^(.*\S)\s*-(.+?)-$/, extractSubtitle)
        .when(/^(.*\S)\s*～(.+?)～$/, extractSubtitle)
        .when(/^(.*\S)\s*\((.+?)\)$/, extractSubtitle)
        .when(/^(.*\S)\s*\[(.+?)\]$/, extractSubtitle)
        .when(/^(.*\S)\s*<(.+?)>$/, extractSubtitle)
    }
    if (title) info.title = title
    if (artist) info.artist = artist
    if (genre) info.genre = genre
    if (subtitles) info.subtitles = subtitles
    if (subartists) info.subartists = subartists
    if (difficulty) info.difficulty = difficulty
    if (level) info.level = level
    return new SongInfo(info)
  }
}
