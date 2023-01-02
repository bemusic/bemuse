import './MusicList.scss'

import { Chart, SongMetadataInCollection } from 'bemuse-types'
import React, { useLayoutEffect, useRef } from 'react'

import { MappingMode } from 'bemuse/rules/mapping-mode'
import MusicListItem from './MusicListItem'
import { Song } from 'bemuse/collection-model/types'
import _ from 'lodash'

export interface ChartProps {
  bpm: {
    init: number
    max: number
    median: number
    min: number
  }
  duration: number
  file: string
  info: {
    title: string
    artist: string
    genre: string
    subtitles: readonly string[]
    subartists: readonly string[]
    difficulty: number
    level: number
  }
  keys: string
  md5: string
  noteCount: number
}

export interface MusicListProps {
  groups: readonly {
    title: string
    songs: readonly SongMetadataInCollection[]
  }[]
  onTouch: () => void
  onSelect: (song: Song, chart?: Chart) => void
  selectedSong: SongMetadataInCollection
  selectedChart: Chart
  playMode: MappingMode
  highlight: string
}

const getSelectedChart = (song: Song, selectedChartInProps: Chart) => {
  // Performance issue:
  //
  // We cannot just send `selectedChart` into every MusicListItem,
  // because this will break PureRenderMixin thus causing every MusicListItem
  // to be re-rendered.
  //
  // If the song being rendered does not contain the selected chart, don’t
  // bother sending it in (just keep it as undefined).
  //
  return _.find(song.charts, (chart) => chart === selectedChartInProps)
}

const MusicList = ({
  groups,
  onTouch,
  onSelect,
  selectedSong,
  selectedChart,
  playMode,
  highlight,
}: MusicListProps) => {
  const activeRectRef = useRef<DOMRect | null>(null)
  const musicListRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    if (!activeRectRef.current) return
    if (!musicListRef.current) return
    const musicListRect = musicListRef.current.getBoundingClientRect()
    const activeRect = activeRectRef.current
    if (
      activeRect.bottom > musicListRect.bottom ||
      activeRect.top < musicListRect.top
    ) {
      musicListRef.current.scrollTop +=
        activeRect.top +
        activeRect.height / 2 -
        (musicListRect.top + musicListRect.height / 2)
    }
  }, [])

  return (
    <ul
      className='MusicList js-scrollable-view'
      onTouchStart={onTouch}
      ref={musicListRef}
    >
      {groups.map(({ title, songs }) => [
        <li key={title} className='MusicListのgroupTitle'>
          {title}
        </li>,
        songs.map((song) => (
          <MusicListItem
            key={song.id}
            song={song}
            selected={song.id === selectedSong.id}
            selectedChart={getSelectedChart(song, selectedChart)}
            playMode={playMode}
            onSelect={(e, song, chart) => {
              activeRectRef.current = e.currentTarget.getBoundingClientRect()
              onSelect(song, chart)
            }}
            highlight={highlight}
          />
        )),
      ])}
    </ul>
  )
}

export default MusicList
