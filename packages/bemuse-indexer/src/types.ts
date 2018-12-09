import { SongInfo } from 'bms'

/* eslint camelcase: off */
/* REASON: Our indexed JSON file is snake-cased */

export type Keys = 'empty' | '14K' | '10K' | '7K' | '5K'

export interface IndexingInputFile {
  name: string
  data: Buffer
}

export interface BGAInfo {
  file: string
  offset: number
}

export interface BPMInfo {
  init: number
  min: number
  max: number
  median: number
}

export interface OutputFileInfo {
  md5: string
  info: SongInfo
  noteCount: number
  bpm: BPMInfo
  duration: number
  scratch: boolean
  keys: Keys
  bga?: BGAInfo
}

export interface OutputSongInfoVideo {
  video_file?: string
  video_offset?: number
}

export interface OutputSongInfo extends OutputSongInfoVideo {
  title: string
  artist: string
  genre: string
  bpm: number
  charts: OutputChart[]
  warnings: string[]
}

export interface OutputChart extends OutputFileInfo {
  file: string
}
