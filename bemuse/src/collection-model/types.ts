/* eslint camelcase: off */
/* REASON: These snake case names are used in our JSON files. */

import { IResources } from 'bemuse/resources/types'

export type Song = {
  id: string
  path: string
  tutorial?: boolean
  video_url?: string
  video_file?: string
  video_offset?: number
  replaygain?: string
  charts: Chart[]

  /** Added by Bemuse at runtime */
  resources?: IResources
}

export type Chart = {
  file: string
  bpm: {
    init: number
    min: number
    max: number
    median: number
  }
  info: {
    title: string
    artist: string
    genre: string
    subtitles: string[]
    subartists: string[]
    difficulty: number
    level: number
  }
}
