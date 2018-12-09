/* eslint camelcase: off */
/* REASON: These snake case names are specified in bmson’s spec. */

export interface Bmson {
  /** bmson version */
  version: string
  /** information, e.g. title, artist, … */
  info: BmsonInfo
  /** location of bar-lines in pulses */
  lines?: BarLine[]
  /** bpm changes */
  bpm_events?: BpmEvent[] | null
  /** stop events */
  stop_events?: StopEvent[] | null
  /** note data */
  sound_channels: SoundChannel[]
  /** bga data */
  bga: BGA
}

export interface BmsonInfo {
  title: string
  subtitle?: string
  artist: string
  /**
   * ["key:value"]
   * @default []
   */
  subartists?: string[]
  genre: string
  /**
   * layout hints, e.g. "beat-7k", "popn-5k", "generic-nkeys"
   * @default "beat-7k"
   */
  mode_hint?: string
  /** e.g. "HYPER", "FOUR DIMENSIONS" */
  chart_name: string
  level: number
  init_bpm: number
  /**
   * relative judge width
   * @default 100
   */
  judge_rank?: number
  /**
   * relative life bar gain
   * @default 100
   */
  total?: number
  /** background image filename */
  back_image?: string
  /** eyecatch image filename */
  eyecatch_image?: string
  /** banner image filename */
  banner_image?: string
  /** preview music filename */
  preview_music?: string
  /**
   * pulses per quarter note
   * @default 240
   */
  resolution?: number
}

/**
 * [A bmson Bar Line](http://bmson-spec.readthedocs.io/en/master/doc/index.html#time-signatures),
 * used for time signature
 */
export interface BarLine {
  /** the pulse number */
  y: number
}

/**
 * [bmson Sound Channel](http://bmson-spec.readthedocs.io/en/master/doc/index.html#sound-channels)
 */
export interface SoundChannel {
  /** sound file name */
  name: string
  /** notes using this sound */
  notes: Note[]
}

export interface Note {
  /** lane */
  x: any
  /** pulse number */
  y: number
  /** length (0: normal note; greater than zero (length in pulses): long note) */
  l: number
  /** continuation flag */
  c: boolean
}

export interface BpmEvent {
  /** pulse number */
  y: number
  bpm: number
}

export interface StopEvent {
  /** pulse number */
  y: number
  /** number of pulses to stop */
  duration: number
}

/**
 * [bmson BGA](http://bmson-spec.readthedocs.io/en/master/doc/index.html#bga-bga)
 */
export interface BGA {
  /** picture id and filename */
  bga_header: BGAHeader[]
  /** picture sequence */
  bga_events: BGAEvent[]
  /** picture sequence overlays bga_events */
  layer_events: BGAEvent[]
  /** picture sequence when missed */
  poor_events: BGAEvent[]
}

export interface BGAHeader {
  id: number
  /** picture file name */
  name: string
}

export interface BGAEvent {
  /** pulse number */
  y: number
  /** corresponds to {BGAHeader}.id */
  id: number
}
