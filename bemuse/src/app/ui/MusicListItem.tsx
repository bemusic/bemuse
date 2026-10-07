import './MusicListItem.scss'

import { Chart, SongMetadataInCollection } from 'bemuse-types'
import React, { MouseEvent, memo } from 'react'

import { MappingMode } from 'bemuse/rules/mapping-mode'
import { Highlight } from './Highlight'
import MusicListItemCharts from './MusicListItemCharts'
import { Song } from 'bemuse/collection-model/types'
import c from 'classnames'
import getPlayableCharts from 'bemuse/music-collection/getPlayableCharts'

export interface MusicListItemProps {
  song: SongMetadataInCollection
  selected: boolean
  selectedChart?: Chart
  playMode: MappingMode
  onSelect: (
    e: MouseEvent<HTMLDivElement | HTMLLIElement>,
    song: Song,
    chart?: Chart
  ) => void
  highlight?: string
}

const ChartList = ({
  song,
  selectedChart,
  onClick,
}: {
  song: SongMetadataInCollection
  selectedChart?: Chart
  onClick: (chart: Chart, e: MouseEvent<HTMLDivElement>) => void
}) => (
  <MusicListItemCharts
    charts={getPlayableCharts(song.charts)}
    selectedChart={selectedChart}
    onChartClick={onClick}
  />
)

const MusicListItem = (props: MusicListItemProps) => {
  const { song, selected, onSelect, highlight } = props
  const handleClick = (e: MouseEvent<HTMLLIElement>) => {
    onSelect(e, song)
  }
  const handleChartClick = (chart: Chart, e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onSelect(e, song, chart)
  }

  const className = c('MusicListItem', {
    'is-active': selected,
    'js-active-song': selected,
  })
  return (
    <li
      className={className}
      onClick={handleClick}
      data-testid='music-list-item'
    >
      {song.tutorial ? (
        <div className='MusicListItemのtutorial'>
          <div className='MusicListItemのcharts'>
            <ChartList onClick={handleChartClick} {...props} />
          </div>
          Tutorial
        </div>
      ) : (
        <div className='MusicListItemのinfo'>
          <div className='MusicListItemのinfo-top'>
            <div className='MusicListItemのtitle'>
              <Highlight text={song.title} highlight={highlight} />
            </div>
            <div className='MusicListItemのcharts'>
              <ChartList onClick={handleChartClick} {...props} />
            </div>
          </div>
          <div className='MusicListItemのinfo-bottom'>
            <div className='MusicListItemのartist'>
              <Highlight text={song.artist} highlight={highlight} />
            </div>
            <div className='MusicListItemのgenre'>
              <Highlight text={song.genre} highlight={highlight} />
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export default memo(MusicListItem)
