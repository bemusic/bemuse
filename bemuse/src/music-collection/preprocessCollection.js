import produce from "immer"

export const preprocessCollection = u({
  songs: u.map(preprocessSong),
})

function preprocessSong(song) {
  return produce(song, draft => {
    if (draft.chart_names) {
      for (const chart of draft.charts) {
        const name = draft.chart_names[chart.file]
        if (!name) continue
        chart.info.subtitles.push(name)
      }
    }
  })
  return song
}

export default preprocessCollection
