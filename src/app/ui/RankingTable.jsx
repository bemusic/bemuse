import './RankingTable.scss'
import React from 'react'
import PropTypes from 'prop-types'
import { formattedAccuracyForRecord } from 'bemuse/rules/accuracy'

const RankingTable = ({ children }) => (
  <table className='RankingTable'>
    <tbody>{children}</tbody>
  </table>
)

RankingTable.propTypes = {
  children: PropTypes.any
}

class Row extends React.Component {
  static propTypes = {
    record: PropTypes.object
  }

  render () {
    return (
      <tr>
        <td className='RankingTableのrank'>
          {this.props.record.rank || (
            <span title='Unable to determine your rank'>??</span>
          )}
        </td>
        <td className='RankingTableのname'>{this.props.record.playerName}</td>
        <td className='RankingTableのscore'>{this.props.record.score}</td>
        <td className='RankingTableのaccuracy'>
          {formattedAccuracyForRecord(this.props.record)}
        </td>
      </tr>
    )
  }
}

export const Message = ({ children }) => (
  <tr>
    <td colSpan={4} className='RankingTableのmessage'>
      {children}
    </td>
  </tr>
)

Message.propTypes = {
  children: PropTypes.any
}

RankingTable.Row = Row
RankingTable.Message = Message

export default RankingTable
