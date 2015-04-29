
import './result-table.scss'
import React from 'react'
import c     from 'classnames'

export default React.createClass({
  render() {
    let result = this.props.result
    return <div className="result-table">
      <table>
        <tr>
          <td>{result['1']}</td>
          <th>Meticulous</th>
        </tr>
        <tr>
          <td>{result['2']}</td>
          <th>Precise</th>
        </tr>
        <tr>
          <td>{result['3']}</td>
          <th>Good</th>
        </tr>
        <tr>
          <td>{result['4']}</td>
          <th>Offbeat</th>
        </tr>
        <tr>
          <td>{result['missed']}</td>
          <th>Missed</th>
        </tr>
      </table>
      <table>
        <tr>
          <td>{result['maxCombo']}</td>
          <th>Max Combo</th>
        </tr>
        <tr>
          <td>{result['accuracy']}</td>
          <th>Accurate</th>
        </tr>
      </table>
      <table className="result-table--total">
        <tr>
          <td>{result['score']}</td>
          <th>Total Score</th>
        </tr>
      </table>
    </div>
  }
})
