
import './RankingTable.scss'
import React from 'react'
import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

export const RankingTable = React.createClass({
  render () {
    return <table className="RankingTable">
      <tbody>
        {this.props.children}
      </tbody>
    </table>
  }
})

export const Row = React.createClass({
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
  },
})

export const Message = React.createClass({
  render () {
    return <tr>
      <td colSpan={4} className="RankingTableのmessage">
        {this.props.children}
      </td>
    </tr>
  },
})

RankingTable.Row = Row
RankingTable.Message = Message

export default RankingTable
