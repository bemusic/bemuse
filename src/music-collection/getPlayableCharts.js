import _ from 'lodash'

import isChartPlayable from './isChartPlayable'

export function getPlayableCharts (charts) {
  return (_(charts)
    .filter(isChartPlayable)
    .orderBy([
      chart => chart.info.difficulty >= 5 ? 1 : 0,
      chart => chart.keys,
      chart => chart.info.level
    ])
    .value()
  )
}

export default getPlayableCharts
