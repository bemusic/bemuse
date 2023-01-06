import './MusicListItemChart.scss'

import React, { MouseEvent } from 'react'

import { Chart } from 'bemuse-types'
import c from 'classnames'
import { getGrade } from 'bemuse/rules/grade'
import { usePersonalRecord } from './usePersonalRecord'

export interface MusicListItemChartProps {
  chart: Chart
  selected: boolean
  onClick: (chart: Chart, e: MouseEvent<HTMLDivElement>) => void
}

const MusicListItemChart = ({
  chart,
  selected,
  onClick,
}: MusicListItemChartProps) => {
  const [isLoading, record] = usePersonalRecord(chart)
  const played = !!record
  let grade = played ? getGrade(record) : null
  if (grade === 'F') grade = null

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(chart, e)
    }
  }

  const className = c('MusicListItemChart', {
    'is-played': played,
    'is-selected': selected,
    'is-grade': !!grade,
  })
  return (
    <div className={className} onClick={handleClick} data-md5={chart.md5}>
      <span className='MusicListItemChartのtext'>
        {isLoading ? '…' : grade || chart.info.level}
      </span>
    </div>
  )
}

export default MusicListItemChart
