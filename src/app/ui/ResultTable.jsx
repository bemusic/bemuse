
import './ResultTable.scss'
import React            from 'react'
import RunningNumber    from 'bemuse/ui/RunningNumber'
import ModalPopup       from 'bemuse/ui/ModalPopup'
import ResultDeltasView from './ResultDeltasView'

export default React.createClass({
  getInitialState () {
    return { deltasModalVisible: false }
  },
  render () {
    let result = this.props.result
    return <div className="ResultTable">
      <table className="ResultTableのtable">
        <tbody>
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
        </tbody>
      </table>
      <table className="ResultTableのtable">
        <tbody>
          <tr>
            <td><RunningNumber value={result['maxCombo']} /></td>
            <th>Max Combo</th>
          </tr>
          <tr>
            <td onClick={this.handleToggleDeltasModal} className="is-clickable">
              <RunningNumber
                formatter={this.formatAccuracy}
                value={result['accuracy']}
              />
            </td>
            <th>Accurate</th>
          </tr>
        </tbody>
      </table>
      <table className="ResultTableのtable is-total">
        <tbody>
          <tr>
            <td><RunningNumber value={result['score']} /></td>
            <th>Total Score</th>
          </tr>
        </tbody>
      </table>
      <ModalPopup
        visible={this.state.deltasModalVisible}
        onBackdropClick={this.handleToggleDeltasModal}
      >
        <ResultDeltasView deltas={result['deltas']} />
      </ModalPopup>
    </div>
  },
  formatAccuracy (value) {
    return (value * 100).toFixed(2) + '%'
  },
  handleToggleDeltasModal () {
    this.setState({ deltasModalVisible: !this.state.deltasModalVisible })
  },
})
