import _ from 'lodash'
import isChartPlayable from './isChartPlayable'

export function sortSongs (songs) {
  return _.orderBy(songs, [
    song => {
      return _(song.charts)
        .filter(isChartPlayable)
        .filter(chart => chart.info.difficulty < 5)
        .filter(chart => chart.info.level > 0)
        .map(chart => chart.info.level)
        .min()
    },
    song => song.bpm,
    song => song.title.toLowerCase()
  ])
}

export default sortSongs
