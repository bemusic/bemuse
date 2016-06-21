
import './OptionsPlayer.scss'
import React   from 'react'
import pure    from 'recompose/pure'
import compose from 'recompose/compose'

import { connect }           from 'react-redux'
import connectIO             from '../../impure-react/connectIO'
import * as OptionsIO        from '../io/OptionsIO'
import * as Options          from '../entities/Options'
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

const enhance = compose(
  connect((state) => ({
    options: state.options,
    scratch: Options.scratchPosition(state.options),
  })),
  connectIO({
    onSetPanel: () => (value) => OptionsIO.setOptions({ 'player.P1.panel': value }),
    onSetScratch: () => (position) => OptionsIO.setScratch(position),
    onSetSpeed: () => (speed) => OptionsIO.setSpeed(speed),
  }),
  pure
)

export const OptionsPlayer = React.createClass({
  propTypes: {
    options: React.PropTypes.object,
    scratch: React.PropTypes.string,
    onClose: React.PropTypes.func,
    onSetPanel: React.PropTypes.func,
    onSetScratch: React.PropTypes.func,
    onSetSpeed: React.PropTypes.func,
  },
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
    this.props.onSetPanel(value)
  },
  handleSelectScratch (value) {
    this.props.onSetScratch(value)
  },
  handleSpeedChange (value) {
    this.props.onSetSpeed(value)
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

export default enhance(OptionsPlayer)
