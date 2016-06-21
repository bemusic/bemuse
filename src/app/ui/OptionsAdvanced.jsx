
import './OptionsAdvanced.scss'
import React   from 'react'
import pure    from 'recompose/pure'
import compose from 'recompose/compose'

import { connect }           from 'react-redux'
import connectIO             from '../../impure-react/connectIO'
import * as OptionsIO        from '../io/OptionsIO'
import OptionsButton         from './OptionsButton'
import OptionsInputField     from './OptionsInputField'

const enhance = compose(
  connect((state) => ({
    options: state.options
  })),
  connectIO({
    onSetOptions: () => (changes) => OptionsIO.setOptions(changes)
  }),
  pure
)

export const OptionsAdvanced = React.createClass({
  propTypes: {
    options: React.PropTypes.object,
    onSetOptions: React.PropTypes.func
  },
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
    this.props.onSetOptions({ 'system.offset.audio-input': `${value}` })
  },
  handleCalibrateButtonClick () {
    let options = 'width=640,height=360'
    window.open('?mode=sync', 'sync', options)
  },
})

export default enhance(OptionsAdvanced)

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
