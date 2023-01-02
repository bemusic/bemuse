import './MusicListItemCharts.scss'

import React, { MouseEvent } from 'react'

import { Chart } from 'bemuse-types'
import MusicListItemChart from './MusicListItemChart'

export interface MusicListItemChartsProps {
  charts: readonly Chart[]
  onChartClick: (chart: Chart, e: MouseEvent<HTMLDivElement>) => void
  selectedChart?: Chart
}

const MusicListItemCharts = ({
  charts,
  onChartClick,
  selectedChart,
}: MusicListItemChartsProps) => (
  <div className='MusicListItemCharts'>
    {charts.map((chart, index) => (
      <MusicListItemChart
        key={index}
        chart={chart}
        selected={!!selectedChart && chart.md5 === selectedChart.md5}
        onClick={onChartClick}
      />
    ))}
  </div>
)

export default MusicListItemCharts
