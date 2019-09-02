import { IResources } from 'bemuse/resources/types'
import { PlayerOptionsPlacement } from 'bemuse/game/player'

export type Song = {
  id: string
  resources?: IResources
  path: string
  tutorial?: boolean
  video_url?: string
  video_file?: string
  video_offset?: number
  replaygain?: string
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

export type StoredOptions = {
  'system.offset.audio-input': string
  'player.P1.speed': string
  'player.P1.panel': PlayerOptionsPlacement
}
