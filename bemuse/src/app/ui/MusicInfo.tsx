import './MusicInfo.scss'

import { Chart, Song } from 'bemuse/collection-model/types'
import MusicChartSelector, {
  MusicChartSelectorProps,
} from './MusicChartSelector'

import { MappingMode } from 'bemuse/rules/mapping-mode'
import MusicChartInfo from './MusicChartInfo'
import MusicInfoTabs from './MusicInfoTabs'
import React from 'react'

export interface MusicInfoProps {
  chart: Chart
  charts: readonly Chart[]
  onChartClick: MusicChartSelectorProps['onChartClick']
  onOptions: () => void
  playMode: MappingMode
  song: Song
}

const MusicInfo = (props: MusicInfoProps) => (
  <section className='MusicInfo'>
    <MusicChartInfo info={props.chart?.info} />
    <MusicChartSelector
      song={props.song}
      selectedChart={props.chart}
      charts={props.charts}
      onChartClick={props.onChartClick}
    />
    <MusicInfoTabs {...props} />
  </section>
)

export default MusicInfo
