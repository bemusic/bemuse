import { MusicServerIndex, SongMetadataInCollection } from 'bemuse-types'
import produce, { Draft } from 'immer'

export interface Preprocessed extends MusicServerIndex {
  songOfTheDayEnabled?: boolean
}

export const preprocessCollection = produce(
  (draft: Draft<Preprocessed>, songs?: SongMetadataInCollection[]) => {
    if (songs) {
      console.dir(songs)
      console.trace()
      draft.songs = songs.map((song) => preprocessSong(song))
    }
  }
)

function preprocessSong(
  song: SongMetadataInCollection
): SongMetadataInCollection {
  if (song.chart_names) {
    return produce(song, (draft) => {
      if (draft.charts) {
        draft.charts = draft.charts.map((chart) => {
          const name = song.chart_names![chart.file]
          if (!name) return chart
          return produce(chart, (draft) => {
            draft.info.subtitles = [...chart.info.subtitles, name]
          })
        })
      }
    })
  }
  return song
}

export default preprocessCollection
