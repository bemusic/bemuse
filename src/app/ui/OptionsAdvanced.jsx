
import './OptionsAdvanced.scss'
import React   from 'react'
import pure    from 'recompose/pure'
import compose from 'recompose/compose'

import { connect }           from 'bemuse/flux'
import Store                 from '../stores/options-store'
import * as Actions          from '../actions/options-actions'
import OptionsButton         from './OptionsButton'
import OptionsInputField     from './OptionsInputField'

export const OptionsAdvanced = React.createClass({
  stringifyLatency (latency) {
    return Math.round(latency) + 'ms'
  },
  parseLatency (latencyText) {
    return parseInt(latencyText, 10)
  },
  render () {
    let options = this.props.options
    return <div className="OptionsAdvanced">
      <LatencyMessageListener onLatency={this.handleAudioInputLatencyChange} />
      <div className="OptionsAdvancedのgroup">
        <label>Latency</label>
        <div className="OptionsAdvancedのgroupItem">
          <OptionsInputField
              value={+options['system.offset.audio-input']}
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
  },
  handleAudioInputLatencyChange (value) {
    Actions.setOptions({ 'system.offset.audio-input': `${value}` })
  },
  handleCalibrateButtonClick () {
    let options = 'width=640,height=360'
    window.open('?mode=sync', 'sync', options)
  },
})

export default compose(
  connect(Store),
  pure
)(OptionsAdvanced)

const LatencyMessageListener = React.createClass({
  render () {
    return null
  },
  componentDidMount () {
    window.addEventListener('message', this.handleMessage)
  },
  componentWillUnmount () {
    window.removeEventListener('message', this.handleMessage)
  },
  handleMessage (event) {
    if (event.data && typeof event.data.latency === 'number') {
      this.props.onLatency(event.data.latency)
    }
  },
})
