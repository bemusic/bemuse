
import './OptionsPlayer.scss'
import React   from 'react'
import pure    from 'recompose/pure'
import compose from 'recompose/compose'

import { connect }           from 'bemuse/flux'
import Store                 from '../stores/options-store'
import * as Actions          from '../actions/options-actions'
import OptionsPlayerSelector from './OptionsPlayerSelector'
import OptionsButton         from './OptionsButton'
import OptionsSpeed          from './OptionsSpeed'

const SCRATCH_OPTIONS = [
  { value: 'left', label: 'Left', },
  { value: 'right', label: 'Right', },
  { value: 'off', label: 'Disabled', },
]

const PANEL_OPTIONS = [
  { value: 'left', label: 'Left', },
  { value: 'center', label: 'Center', },
  { value: 'right', label: 'Right', },
]

export const OptionsPlayer = React.createClass({
  render () {
    return <div className="OptionsPlayer">

      <OptionsPlayer.Row label="Speed">
        <OptionsSpeed
            value={this.props.options['player.P1.speed']}
            onChange={this.handleSpeedChange} />
        <div className="OptionsPlayerのspeedHint">
          You can also change the speed in-game<br />using the Up and Down arrow keys.
        </div>
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Scratch">
        <OptionsPlayerSelector type="scratch"
            options={SCRATCH_OPTIONS}
            onSelect={this.handleSelectScratch}
            value={this.props.scratch} />
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Panel">
        <OptionsPlayerSelector type="panel"
            options={PANEL_OPTIONS}
            onSelect={this.handleSelectPanel}
            value={this.props.options['player.P1.panel']} />
      </OptionsPlayer.Row>

      <div className="OptionsPlayerのbuttons">
        <OptionsButton onClick={this.props.onClose}>Save & Exit</OptionsButton>
      </div>

    </div>
  },
  handleSelectPanel (value) {
    Actions.setOptions({ 'player.P1.panel': value })
  },
  handleSelectScratch (value) {
    Actions.setScratch(value)
  },
  handleSpeedChange (value) {
    Actions.setOptions({ 'player.P1.speed': value })
  }
})

OptionsPlayer.Row = React.createClass({
  render () {
    return <div className="OptionsPlayerのrow">
      <label>{this.props.label}</label>
      <div>{this.props.children}</div>
    </div>
  }
})

export default compose(
  connect(Store),
  pure
)(OptionsPlayer)
