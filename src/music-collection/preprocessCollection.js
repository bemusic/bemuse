import u from 'updeep'

export const preprocessCollection = u({
  songs: u.map(preprocessSong)
})

function preprocessSong (song) {
  if (song.chart_names) {
    song = u({
      charts: u.map((chart) => {
        const name = song.chart_names[chart.file]
        if (!name) return chart
        return u({
          info: {
            subtitles: (subtitles) => [ ...subtitles, name ]
          }
        }, chart)
      })
    }, song)
  }
  return song
}

export default preprocessCollection
