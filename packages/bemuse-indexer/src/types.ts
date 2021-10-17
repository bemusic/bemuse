import type {
  ChartBga as BGAInfo,
  ChartBpm as BPMInfo,
  Chart as OutputChart,
  SongMetadata,
} from 'bemuse-types'

/* eslint camelcase: off */
/* REASON: Our indexed JSON file is snake-cased */

export type Keys = 'empty' | '14K' | '10K' | '7K' | '5K'

export interface IndexingInputFile {
  name: string
  data: Buffer
}

export type { BGAInfo, BPMInfo, OutputChart }

export interface OutputFileInfo extends Omit<OutputChart, 'file'> {}

export interface OutputSongInfoVideo
  extends Pick<SongMetadata, 'video_file' | 'video_offset'> {}

export interface OutputSongInfo
  extends Pick<
    SongMetadata,
    | 'title'
    | 'artist'
    | 'genre'
    | 'bpm'
    | 'charts'
    | 'warnings'
    | 'video_file'
    | 'video_offset'
  > {}
