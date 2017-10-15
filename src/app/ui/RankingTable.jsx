
import './RankingTable.scss'
import React from 'react'
import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

const RankingTable = ({ children }) => (
  <table className="RankingTable">
    <tbody>
      {children}
    </tbody>
  </table>
)

class Row extends React.Component {
  render () {
    return <tr>
      <td className="RankingTableのrank">
        {this.props.record.rank || <span title="Unable to determine your rank">??</span>}
      </td>
      <td className="RankingTableのname">
        {this.props.record.playerName}
      </td>
      <td className="RankingTableのscore">
        {this.props.record.score}
      </td>
      <td className="RankingTableのaccuracy">
        {formattedAccuracyForRecord(this.props.record)}
      </td>
    </tr>
  }
}

export const Message = ({ children }) => (
  <tr>
    <td colSpan={4} className="RankingTableのmessage">
      {children}
    </td>
  </tr>
)

RankingTable.Row = Row
RankingTable.Message = Message

export default RankingTable
