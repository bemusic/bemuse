import isChartPlayable from './isChartPlayable'
import _ from 'lodash'

export function getPlayableCharts (charts) {
  return (_(charts)
    .filter(isChartPlayable)
    .orderBy([
      chart => chart.info.difficulty >= 5 ? 1 : 0,
      chart => chart.info.level
    ])
    .value()
  )
}

export default getPlayableCharts
