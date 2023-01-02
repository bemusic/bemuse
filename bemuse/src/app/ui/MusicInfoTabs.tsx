import './MusicInfoTabs.scss'

import { Chart, Song } from 'bemuse/collection-model/types'
import React, { useState } from 'react'

import { Icon } from 'bemuse/fa'
import { MappingMode } from 'bemuse/rules/mapping-mode'
import MusicInfoTabInformation from './MusicInfoTabInformation'
import MusicInfoTabStats from './MusicInfoTabStats'
import RankingContainer from './RankingContainer'
import c from 'classnames'

export interface MusicInfoTabsProps {
  chart: Chart
  onOptions: () => void
  playMode: MappingMode
  song: Song
}

const TABS = ['Stats', 'Ranking', 'Information'] as const

const MusicInfoTab = ({
  isActive,
  title,
  onClick,
}: {
  isActive: boolean
  title: string
  onClick: () => void
}) => {
  return (
    <li
      className={c('MusicInfoTabsのtab', {
        'is-active': isActive,
      })}
      onClick={onClick}
    >
      {title}
    </li>
  )
}

const MusicInfoPanel = ({
  selectedTab,
  song,
  chart,
  playMode,
}: {
  selectedTab: keyof typeof TABS
  song: Song
  chart: Chart
  playMode: MappingMode
}) => {
  switch (selectedTab) {
    case 0:
      return <MusicInfoTabStats chart={chart} />
    case 1:
      return <RankingContainer chart={chart} playMode={playMode} />
    case 2:
      return <MusicInfoTabInformation song={song} />
    default:
      return <>Unknown tab</>
  }
}

const MusicInfoTabs = (props: MusicInfoTabsProps) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const onClick = (index: number) => () => setSelectedTab(index)
  return (
    <section className='MusicInfoTabs'>
      <ul className='MusicInfoTabsのtabs'>
        <li
          className='MusicInfoTabsのoptions'
          onClick={props.onOptions}
          data-testid='options-button'
        >
          <Icon name='gear' /> Options
        </li>
        {TABS.map((title, index) => (
          <MusicInfoTab
            key={index}
            isActive={selectedTab === index}
            title={title}
            onClick={onClick(index)}
          />
        ))}
      </ul>
      <div
        className={c('MusicInfoTabsのpanel', {
          'is-without-padding': selectedTab === 1,
        })}
      >
        <MusicInfoPanel selectedTab={selectedTab} {...props} />
      </div>
    </section>
  )
}

export default MusicInfoTabs
