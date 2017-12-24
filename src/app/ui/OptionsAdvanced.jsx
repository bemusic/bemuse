import * as Options from '../entities/Options'
import * as OptionsIO from '../io/OptionsIO'
import './OptionsAdvanced.scss'

import compose from 'recompose/compose'
import pure from 'recompose/pure'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import connectIO from '../../impure-react/connectIO'
import OptionsButton from './OptionsButton'
import OptionsInputField from './OptionsInputField'

const enhance = compose(
  connect((state) => ({
    options: state.options
  })),
  connectIO({
    onUpdateOptions: () => (updater) => OptionsIO.updateOptions(updater)
  }),
  pure
)

class OptionsAdvanced extends React.Component {
  static propTypes = {
    options: PropTypes.object,
    onUpdateOptions: PropTypes.func
  }
  stringifyLatency (latency) {
    return Math.round(latency) + 'ms'
  }
  parseLatency (latencyText) {
    return parseInt(latencyText, 10)
  }
  render () {
    let options = this.props.options
    return <div className='OptionsAdvanced'>
      <LatencyMessageListener onLatency={this.handleAudioInputLatencyChange} />
      <div className='OptionsAdvancedのgroup'>
        <label>Latency</label>
        <div className='OptionsAdvancedのgroupItem'>
          <OptionsInputField
            value={Options.audioInputLatency(options)}
            parse={this.parseLatency}
            stringify={this.stringifyLatency}
            validator={/^\d+(?:ms)?$/}
            onChange={this.handleAudioInputLatencyChange} />
          <label>audio</label>
        </div>
        <OptionsButton
          onClick={this.handleCalibrateButtonClick}>Calibrate</OptionsButton>
      </div>
    </div>
  }
  handleAudioInputLatencyChange = (value) => {
    this.props.onUpdateOptions(Options.changeAudioInputLatency(value))
  }
  handleCalibrateButtonClick = () => {
    let options = 'width=640,height=360'
    window.open('?mode=sync', 'sync', options)
  }
}

export default enhance(OptionsAdvanced)

class LatencyMessageListener extends React.Component {
  static propTypes = {
    onLatency: PropTypes.func
  }
  render () {
    return null
  }
  componentDidMount () {
    window.addEventListener('message', this.handleMessage)
  }
  componentWillUnmount () {
    window.removeEventListener('message', this.handleMessage)
  }
  handleMessage = (event) => {
    if (event.data && typeof event.data.latency === 'number') {
      this.props.onLatency(event.data.latency)
    }
  }
}
