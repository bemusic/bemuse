import produce from 'immer'

export const preprocessCollection = produce((draft, songs) => {
  if (songs) {
    draft.songs = songs.map((song) => preprocessSong(song))
  }
})

function preprocessSong(song) {
  if (song.chart_names) {
    song = produce(song, (draft) => {
      if (draft.charts) {
        draft.charts = draft.charts.map((chart) => {
          const name = song.chart_names[chart.file]
          if (!name) return chart
          return produce(chart, (draft) => {
            draft.info = {
              subtitles: (subtitles) => [...subtitles, name],
            }
          })
        })
      }
    })
  }
  return song
}

export default preprocessCollection
