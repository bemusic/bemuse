import './RankingTable.scss'

import React, { ReactNode } from 'react'
import { ScoreCount, formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

const RankingTable = ({ children }: { children: ReactNode }) => (
  <table className='RankingTable'>
    <tbody>{children}</tbody>
  </table>
)

export interface RowProps {
  record: {
    rank?: number
    playerName: string
    score: number
    count: ScoreCount
    total: number
  }
}

export const Row = ({ record }: RowProps) => (
  <tr>
    <td className='RankingTableのrank'>
      {record.rank || <span title='Unable to determine your rank'>??</span>}
    </td>
    <td className='RankingTableのname'>{record.playerName}</td>
    <td className='RankingTableのscore'>{record.score}</td>
    <td className='RankingTableのaccuracy'>
      {formattedAccuracyForRecord(record)}
    </td>
  </tr>
)

export const Message = ({ children }: { children: ReactNode }) => (
  <tr>
    <td colSpan={4} className='RankingTableのmessage'>
      {children}
    </td>
  </tr>
)

export default RankingTable
