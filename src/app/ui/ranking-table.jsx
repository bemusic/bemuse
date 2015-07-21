
import './ranking-table.scss'
import React from 'react'
import c     from 'classnames'

export const RankingTable = React.createClass({
  render() {
    return <table className="ranking-table">
      <tbody>
        {this.props.children}
      </tbody>
    </table>
  }
})

export const Row = React.createClass({
  render() {
    return <tr>
      <td className="ranking-table--rank">
        {this.props.rank}
      </td>
      <td className="ranking-table--name">
        {this.props.record.playerName}
      </td>
      <td className="ranking-table--score">
        {this.props.record.score}
      </td>
      <td className="ranking-table--accuracy">
        {this.renderAccuracy(this.props.record.count, this.props.record.total)}%
      </td>
    </tr>
  },
  renderAccuracy(count, total) {
    var accuracy = (count[0] + count[1] * 0.8 + count[2] * 0.5) / total
    return (accuracy * 100).toFixed(2)
  }
})

RankingTable.Row = Row

export default RankingTable
