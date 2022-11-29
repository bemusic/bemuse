import './MusicChartSelector.scss'

import type { Chart, SongMetadata } from 'bemuse-types'
import MusicChartSelectorItem, {
  MusicChartSelectorItemProps,
} from './MusicChartSelectorItem'

import React from 'react'

export interface MusicChartSelectorProps {
  charts: readonly Chart[]
  song: SongMetadata
  selectedChart: Chart
  onChartClick: MusicChartSelectorItemProps['onChartClick']
}

const MusicChartSelector = ({
  charts,
  song,
  selectedChart,
  onChartClick,
}: MusicChartSelectorProps) => (
  <ul className='MusicChartSelector'>
    {charts.map((chart, index) => (
      <MusicChartSelectorItem
        key={index}
        chart={chart}
        isTutorial={!!song.tutorial}
        isSelected={chart.md5 === selectedChart.md5}
        onChartClick={onChartClick}
      />
    ))}
  </ul>
)

export default MusicChartSelector
