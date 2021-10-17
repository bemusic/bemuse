/* eslint-disable camelcase */

/**
 * The Bemuse Music Server Index File. This is the contents of `index.json`.
 * @public
 */
export interface MusicServerIndex {
  /**
   * Available songs.
   * @public
   */
  songs: SongMetadataInCollection[]
}

/**
 * The song metadata. Would find this in `song.json`.
 */
export interface SongMetadata {
  title: string
  artist: string
  genre: string

  /** Representative BPM — used for sorting songs */
  bpm: number

  /** Artist’s canonical name */
  alias_of?: string

  /** Artist’s website */
  artist_url: string

  /** BMS entry website (e.g. event venue page) */
  bms_url?: string

  /** Song website (e.g. soundcloud) */
  song_url?: string

  /** URL to the BGA on YouTube */
  youtube_url?: string

  /** Date (ISO formatted) */
  added?: string

  /** ReplayGain — format "-X.YY dB" */
  replaygain: string

  /** Video file from bmson */
  video_file?: string

  /** Relative or absolute URL to the webm video. Overrides `video_file` */
  video_url?: string

  /** When in the song to begin playing the video */
  video_offset?: number | string

  /** ID for https://bmssearch.net/ */
  bmssearch_id?: number | string

  /** Relative or absolute URL to the README markdown file. */
  readme: string

  /** Charts */
  charts: Chart[]

  /** Warnings generating while indexing */
  warnings?: any[]

  /**
   * Mapping from filename to chart name.
   * Useful for when the BMS file itself does not contain subtitles.
   */
  chart_names?: Record<string, string>

  /** Link to listen to long version of the song (e.g. soundcloud). */
  long_url?: string

  /** This song is initially released. */
  initial?: boolean

  /** The start offset of the preview into the song. */
  preview_start?: number

  /** The URL to the MP3 file. Dedfault is `_bemuse_preview.mp3` */
  preview_url?: number

  /** Whether this song is a tutorial. */
  tutorial?: number

  /** Whether this song is exclusive to Bemuse (not published elsewhere). */
  exclusive?: boolean
}

export interface SongMetadataInCollection extends SongMetadata {
  /** Unique ID for the song */
  id: string

  /** Relative URL from `index.json` to song folder */
  path: string
}

export interface Chart {
  md5: string
  info: ChartInfo
  noteCount: number
  bpm: ChartBpm
  duration: number
  scratch: boolean
  keys: '5K' | '7K' | '10K' | '14K' | 'empty'
  file: string
  bga?: ChartBga
}

/**
 * BGA information embedded in chart files.
 * Not used by Bemuse — in Bemuse one song can contain one dedicated video file.
 */
export interface ChartBga {
  file: string
  offset: number
}

export interface ChartBpm {
  init: number
  min: number
  median: number
  max: number
}

export interface ChartInfo {
  title: string
  artist: string
  genre: string
  subtitles: string[]
  subartists: string[]
  difficulty: number
  level: number
}
