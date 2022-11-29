import './MusicInfoTabStats.scss'

import React, { ReactNode } from 'react'

import { ChartProps } from './MusicList'
import { Icon } from 'bemuse/fa'
import formatTime from '../../utils/formatTime'
import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'
import { usePersonalRecord } from './usePersonalRecord'

export interface MusicInfoTabStatsProps {
  chart: ChartProps
  user?: string
}

const WhenNotLoading = ({
  loading,
  children,
}: {
  loading: boolean
  children: ReactNode
}) => (loading ? <Icon name='spinner' spin /> : <>{children}</>)

const Message = ({ show }: { show: boolean }) =>
  show ? (
    <div className='MusicInfoTabStatsのmessage'>
      Please log in or create an account to save your play statistics.
    </div>
  ) : null

const MusicInfoTabStats = ({ chart, user }: MusicInfoTabStatsProps) => {
  const [loading, record] = usePersonalRecord(chart)
  return (
    <div className='MusicInfoTabStats'>
      <Message show={!user} />
      <dl className='MusicInfoTabStatsのcolumn is-left'>
        <dt>Notes</dt>
        <dd>{chart.noteCount}</dd>
        <dt>BPM</dt>
        <dd>{chart.bpm.median}</dd>
        <dt>Duration</dt>
        <dd>{formatTime(chart.duration)}</dd>
        <dt>Play Count</dt>
        <dd>
          <WhenNotLoading loading={loading}>
            {record ? record.playCount : user ? '0' : '-'}
          </WhenNotLoading>
        </dd>
      </dl>
      <dl className='MusicInfoTabStatsのcolumn is-right'>
        <dt>Best Score</dt>
        <dd>
          <WhenNotLoading loading={loading}>
            {record ? record.score : '-'}
          </WhenNotLoading>
        </dd>

        <dt>Accuracy</dt>
        <dd>
          <WhenNotLoading loading={loading}>
            {record ? formattedAccuracyForRecord(record) : '-'}
          </WhenNotLoading>
        </dd>

        <dt>Max Combo</dt>
        <dd>
          <WhenNotLoading loading={loading}>
            {record ? (
              <span>
                {record.combo} <small>/ {record.total}</small>
              </span>
            ) : (
              <>-</>
            )}
          </WhenNotLoading>
        </dd>
      </dl>
    </div>
  )
}

export default MusicInfoTabStats
