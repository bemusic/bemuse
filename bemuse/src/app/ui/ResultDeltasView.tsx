import './ResultDeltasView.scss'

import Panel from 'bemuse/ui/Panel'
import React from 'react'
import _ from 'lodash'
import getNonMissedDeltas from '../interactors/getNonMissedDeltas'
import mean from 'mean'
import median from 'median'
import { timegate } from 'bemuse/game/judgments'
import variance from 'variance'

const ms = (delta: number) => `${(delta * 1000).toFixed(1)} ms`

const group = (deltas: readonly number[]) =>
  _(deltas)
    .map((delta) => Math.floor(delta * 100))
    .countBy((bucket) => bucket)
    .value()

const Row = ({
  text,
  data,
  options = {},
}: {
  text: string
  data: number
  options?: {
    showEarlyLate?: boolean
  }
}) => {
  return (
    <tr>
      <th>{text}</th>
      <td className='is-number'>{ms(data)}</td>
      <td>
        {options.showEarlyLate !== false
          ? data > 0
            ? '(late)'
            : data < 0
            ? '(early)'
            : ''
          : null}
      </td>
    </tr>
  )
}

export interface ResultDeltasViewProps {
  deltas: readonly number[]
}

const ResultDeltasView = ({ deltas }: ResultDeltasViewProps) => {
  const nonMissDeltas = getNonMissedDeltas(deltas)
  const offDeltas = deltas.filter((delta) => timegate(1) <= Math.abs(delta))
  const earlyCount = offDeltas.filter((delta) => delta < 0).length
  const lateCount = offDeltas.filter((delta) => delta > 0).length
  const groups = group(deltas)
  const stats = _.range(-20, 20).map((bucket) => ({
    bucket,
    count: groups[bucket] || 0,
  }))
  const max = _(stats).map('count').max() ?? 0
  const height = (value: number) => Math.ceil((value / Math.max(max, 1)) * 128)
  return (
    <div className='ResultDeltasView'>
      <Panel title='Accuracy Data'>
        <div className='ResultDeltasViewのcontent'>
          <div className='ResultDeltasViewのhistogram'>
            {stats.map(({ bucket, count }) => (
              <div
                key={bucket}
                className='ResultDeltasViewのhistogramBar'
                data-bucket={bucket}
                style={{ height: height(count) }}
              />
            ))}
          </div>
          <div className='ResultDeltasViewのnumber is-early'>
            <strong>{earlyCount}</strong> EARLY
          </div>
          <div className='ResultDeltasViewのnumber is-late'>
            <strong>{lateCount}</strong> LATE
          </div>
          <table className='ResultDeltasViewのinfo'>
            <tbody>
              <Row text='Mean:' data={mean(nonMissDeltas)} />
              <Row
                text='S.D:'
                data={Math.sqrt(variance(nonMissDeltas))}
                options={{ showEarlyLate: false }}
              />
              <Row text='Median:' data={median(nonMissDeltas)} />
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export default ResultDeltasView
