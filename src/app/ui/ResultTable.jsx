import * as Analytics from '../analytics'
import './ResultTable.scss'

import ModalPopup from 'bemuse/ui/ModalPopup'
import React from 'react'
import PropTypes from 'prop-types'
import RunningNumber from 'bemuse/ui/RunningNumber'

import FirstTimeTip from './FirstTimeTip'
import ResultDeltasView from './ResultDeltasView'

export default class ResultTable extends React.Component {
  static propTypes = {
    result: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { deltasModalVisible: false }
  }
  render () {
    let { result } = this.props
    return <div className='ResultTable'>
      <table className='ResultTableのtable'>
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
      <table className='ResultTableのtable'>
        <tbody>
          <tr title={`Total combos: ${result['totalCombo']}`}>
            <td><RunningNumber value={result['maxCombo']} /></td>
            <th>Max Combo</th>
          </tr>
          <tr>
            <td onClick={this.handleViewDeltas} className='is-clickable'>
              <FirstTimeTip featureKey='deltas' tip='View detailed accuracy data'>
                <RunningNumber
                  formatter={this.formatAccuracy}
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
  }
  formatAccuracy (value) {
    return (value * 100).toFixed(2) + '%'
  }
  handleToggleDeltasModal = () => {
    this.setState({ deltasModalVisible: !this.state.deltasModalVisible })
  }
  handleViewDeltas = () => {
    this.handleToggleDeltasModal()
    Analytics.send('ResultTable', 'view deltas')
  }
}
