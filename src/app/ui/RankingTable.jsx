
import './RankingTable.scss'
import React from 'react'

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
        {this.renderAccuracy(this.props.record.count, this.props.record.total)}%
      </td>
    </tr>
  },
  renderAccuracy (count, total) {
    var accuracy = (count[0] + count[1] * 0.8 + count[2] * 0.5) / total
    return (accuracy * 100).toFixed(2)
  }
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
