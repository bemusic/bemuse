
import _ from 'lodash'

export function isChartPlayable (chart) {
  return chart.keys === '7K' || chart.keys === '5K'
}

export function visibleCharts (charts) {
  return (_(charts)
    .filter(isChartPlayable)
    .orderBy([
      chart => chart.info.difficulty >= 5 ? 1 : 0,
      chart => chart.info.level
    ])
    .value()
  )
}
