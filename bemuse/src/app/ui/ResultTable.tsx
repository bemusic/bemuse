import './ResultTable.scss'

import * as Analytics from '../analytics'

import React, { useState } from 'react'

import FirstTimeTip from './FirstTimeTip'
import ModalPopup from 'bemuse/ui/ModalPopup'
import { Result } from './ResultScene'
import ResultDeltasView from './ResultDeltasView'
import RunningNumber from 'bemuse/ui/RunningNumber'

const formatAccuracy = (value: number) => {
  return (value * 100).toFixed(2) + '%'
}

export interface ResultTableProps {
  result: Result
}

const ResultTable = ({ result }: ResultTableProps) => {
  const [deltasModalVisible, setDeltasModalVisible] = useState(false)

  const handleToggleDeltasModal = () => {
    setDeltasModalVisible((flag) => !flag)
  }

  const handleViewDeltas = () => {
    handleToggleDeltasModal()
    Analytics.send('ResultTable', 'view deltas')
  }

  return (
    <div className='ResultTable'>
      <table className='ResultTableのtable'>
        <tbody>
          <tr>
            <td>
              <RunningNumber value={result['1']} />
            </td>
            <th>Meticulous</th>
          </tr>
          <tr>
            <td>
              <RunningNumber value={result['2']} />
            </td>
            <th>Precise</th>
          </tr>
          <tr>
            <td>
              <RunningNumber value={result['3']} />
            </td>
            <th>Good</th>
          </tr>
          <tr>
            <td>
              <RunningNumber value={result['4']} />
            </td>
            <th>Offbeat</th>
          </tr>
          <tr>
            <td>
              <RunningNumber value={result['missed']} />
            </td>
            <th>Missed</th>
          </tr>
        </tbody>
      </table>
      <table className='ResultTableのtable'>
        <tbody>
          <tr title={`Total combos: ${result['totalCombo']}`}>
            <td>
              <RunningNumber value={result['maxCombo']} />
            </td>
            <th>Max Combo</th>
          </tr>
          <tr>
            <td onClick={handleViewDeltas} className='is-clickable'>
              <FirstTimeTip
                featureKey='deltas'
                tip='View detailed accuracy data'
              >
                <RunningNumber
                  formatter={formatAccuracy}
                  value={result['accuracy']}
                />
              </FirstTimeTip>
            </td>
            <th>Accurate</th>
          </tr>
        </tbody>
      </table>
      <table className='ResultTableのtable is-total'>
        <tbody>
          <tr>
            <td>
              <RunningNumber value={result['score']} />
            </td>
            <th>Total Score</th>
          </tr>
        </tbody>
      </table>
      <ModalPopup
        visible={deltasModalVisible}
        onBackdropClick={handleToggleDeltasModal}
      >
        <ResultDeltasView deltas={result['deltas']} />
      </ModalPopup>
    </div>
  )
}

export default ResultTable
