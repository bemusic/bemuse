import { useImmer } from "use-immer"

export const preprocessCollection = u({
  songs: u.map(preprocessSong),
})

function preprocessSong(song) {
  const useImmerMap = new Map()
  if (song.chart_names) {
    song = useImmer(
      {
        charts: useImmerMap((chart) => {
          const name = song.chart_names[chart.file]
          if (!name) return chart
          return useImmer(
            {
              info: {
                subtitles: (subtitles) => [...subtitles, name],
              },
            },
            chart
          )
        }),
      },
      song
    )
  }
  return song
}

export default preprocessCollection
