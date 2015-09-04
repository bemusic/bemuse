
import './ResultTable.scss'
import React          from 'react'
import RunningNumber  from 'bemuse/ui/RunningNumber'

export default React.createClass({
  render() {
    let result = this.props.result
    return <div className="ResultTable">
      <table>
        <tr>
          <td><RunningNumber value={result['1']} /></td>
          <th>Meticulous</th>
        </tr>
        <tr>
          <td><RunningNumber value={result['2']} /></td>
          <th>Precise</th>
        </tr>
        <tr>
          <td><RunningNumber value={result['3']} /></td>
          <th>Good</th>
        </tr>
        <tr>
          <td><RunningNumber value={result['4']} /></td>
          <th>Offbeat</th>
        </tr>
        <tr>
          <td><RunningNumber value={result['missed']} /></td>
          <th>Missed</th>
        </tr>
      </table>
      <table>
        <tr>
          <td><RunningNumber value={result['maxCombo']} /></td>
          <th>Max Combo</th>
        </tr>
        <tr>
          <td><RunningNumber
              formatter={this.formatAccuracy}
              value={result['accuracy']} /></td>
          <th>Accurate</th>
        </tr>
      </table>
      <table className="ResultTableのtotal">
        <tr>
          <td><RunningNumber value={result['score']} /></td>
          <th>Total Score</th>
        </tr>
      </table>
    </div>
  },
  formatAccuracy(value) {
    return (value * 100).toFixed(2) + '%'
  },
})
