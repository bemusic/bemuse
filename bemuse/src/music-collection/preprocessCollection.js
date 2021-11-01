import produce from "immer"

export const preprocessCollection = (song) => 
  produce((draft) => {
    draft.song = preprocessSong(song)
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
}

export default preprocessCollection
