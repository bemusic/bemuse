import { match } from '../util/match'
import { assign } from '../util/lodash'
import { BMSChart } from '../bms/chart'

/**
 * @public
 */
export interface ISongInfoData {
  /** the song title */
  title: string
  /** the song artist */
  artist: string
  /** the song genre */
  genre: string
  /**
   * the song's subtitles, one line per element.
   * The subtitle may be used to represent the difficulty name,
   * such as NORMAL, HYPER, ANOTHER.
   */
  subtitles: string[]
  /**
   * the song's other artists, one artist per element.
   */
  subartists: string[]
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
  difficulty: number
  /**
   * the level of the song.
   * When converted from a BMS chart, this is the value of `#PLAYLEVEL` header.
   */
  level: number
}

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
 * Having parsed it using `Compiler.compile` into a {@link BMSChart},
 * you can create a {@link SongInfo} using `fromBMSChart()`:
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
 *
 * @public
 */
export class SongInfo implements ISongInfoData {
  title: string
  artist: string
  genre: string
  subtitles: string[]
  subartists: string[]
  difficulty: number
  level: number

  /**
   * Constructs a SongInfo with given data
   * @param info - the properties to set on this new instance
   */
  constructor(info: { [propertyName: string]: any }) {
    this.title = 'NO TITLE'
    this.artist = 'NO ARTIST'
    this.genre = 'NO GENRE'
    this.subtitles = []
    this.subartists = []
    this.difficulty = 0
    this.level = 0
    if (info) assign(this, info)
  }

  /**
   * Constructs a new SongInfo object from a {@link BMSChart}.
   * @param chart - A {@link BMSChart} to construct a SongInfo from
   */
  static fromBMSChart(chart: BMSChart) {
    void BMSChart
    var info: Partial<ISongInfoData> = {}
    var title = chart.headers.get('title')
    var artist = chart.headers.get('artist')
    var genre = chart.headers.get('genre')
    var difficulty = +chart.headers.get('difficulty')! || 0
    var level = +chart.headers.get('playlevel')! || 0
    var subtitles = chart.headers.getAll('subtitle')
    var subartists = chart.headers.getAll('subartist')
    if (typeof title === 'string' && !subtitles) {
      var extractSubtitle = function(m: string[]) {
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
