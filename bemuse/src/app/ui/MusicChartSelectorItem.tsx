import './MusicChartSelectorItem.scss'

import { Chart } from 'bemuse-types'
import { Icon } from 'bemuse/fa'
import React from 'react'
import c from 'classnames'

const Text = ({
  isTutorial,
  chart,
}: {
  isTutorial?: boolean
  chart: Chart
}) => {
  if (isTutorial) {
    const gameMode = chart.keys === '5K' ? '5 keys' : '7 keys'
    return <>{`Start Tutorial (${gameMode})`}</>
  }
  return (
    <span className='MusicChartSelectorItemのlevel'>{chart.info.level}</span>
  )
}

export interface MusicChartSelectorItemProps {
  chart: Chart
  isSelected?: boolean
  isReplayable?: boolean
  isTutorial?: boolean
  onChartClick: (chart: Chart, e: React.MouseEvent<HTMLLIElement>) => void
}

const MusicChartSelectorItem = ({
  chart,
  isSelected,
  isReplayable,
  isTutorial,
  onChartClick,
}: MusicChartSelectorItemProps) => {
  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onChartClick(chart, e)
  }

  const classes = c('MusicChartSelectorItem', {
    'is-active': isSelected,
    'is-replayable': isReplayable,
    'is-tutorial': isTutorial,
    'is-insane': chart.info.difficulty >= 5,
    'is-5keys': chart.keys === '5K',
  })
  return (
    <li
      className={classes}
      onClick={handleClick}
      data-testid={isSelected ? 'play-selected-chart' : undefined}
    >
      <Text isTutorial={isTutorial} chart={chart} />
      <span className='MusicChartSelectorItemのplay'>
        <Icon name='play' />
      </span>
    </li>
  )
}

export default MusicChartSelectorItem
