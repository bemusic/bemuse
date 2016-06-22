
import './OptionsPlayer.scss'
import React   from 'react'
import pure    from 'recompose/pure'
import compose from 'recompose/compose'

import { withProps }         from 'recompose'
import { connect }           from 'react-redux'
import connectIO             from '../../impure-react/connectIO'
import * as OptionsIO        from '../io/OptionsIO'
import * as Options          from '../entities/Options'
import OptionsPlayerSelector from './OptionsPlayerSelector'
import OptionsButton         from './OptionsButton'
import OptionsSpeed          from './OptionsSpeed'
import OptionsInputField     from './OptionsInputField'
import OptionsCheckbox       from './OptionsCheckbox'

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
    onSetLeadTime: () => (leadTime) => OptionsIO.setLeadTime(leadTime),
    onToggleBackgroundAnimationsEnabled: ({ options }) => () => (
      OptionsIO.setOptions({
        'system.bga.enabled': Options.toggleOption(options['system.bga.enabled'])
      })
    ),
    onToggleAutoVelocityEnabled: ({ options }) => () => (
      OptionsIO.setOptions({
        'player.P1.auto-velocity': Options.toggleOption(options['player.P1.auto-velocity'])
      })
    )
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
    onToggleBackgroundAnimationsEnabled: React.PropTypes.func,
    onToggleAutoVelocityEnabled: React.PropTypes.func,
    onSetLeadTime: React.PropTypes.func
  },
  render () {
    return <div className="OptionsPlayer">
      <OptionsPlayer.Row
        label="Speed"
        hidden={Options.isAutoVelocityEnabled(this.props.options)}
      >
        <OptionsSpeed
          value={this.props.options['player.P1.speed']}
          onChange={this.props.onSetSpeed} />
        <div className="OptionsPlayerのspeedHint">
          You can also change the speed in-game<br />using the Up and Down arrow keys.
        </div>
      </OptionsPlayer.Row>

      <OptionsPlayer.Row
        label="LeadTime"
        hidden={!Options.isAutoVelocityEnabled(this.props.options)}
      >
        <OptionsLeadTimeInputField
          value={Options.leadTime(this.props.options)}
          onChange={this.props.onSetLeadTime}
          style={{ width: '5em' }}
        />
        <div className="OptionsPlayerのspeedHint">
          Speed will be automatically adjusted<br />to maintain a consistent note velocity.
        </div>
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Scratch">
        <OptionsPlayerSelector type="scratch"
          options={SCRATCH_OPTIONS}
          onSelect={this.props.onSetScratch}
          value={this.props.scratch} />
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Panel">
        <OptionsPlayerSelector type="panel"
          options={PANEL_OPTIONS}
          onSelect={this.props.onSetPanel}
          value={this.props.options['player.P1.panel']} />
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="BGA">
        <OptionsCheckbox
          checked={Options.isBackgroundAnimationsEnabled(this.props.options)}
          onToggle={this.props.onToggleBackgroundAnimationsEnabled}
        >
          Enable background animations <span className="OptionsPlayerのhint">(720p, alpha)</span>
        </OptionsCheckbox>
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="AutoVel">
        <OptionsCheckbox
          checked={Options.isAutoVelocityEnabled(this.props.options)}
          onToggle={this.props.onToggleAutoVelocityEnabled}
        >
          Maintain absolute note velocity <span className="OptionsPlayerのhint">(advanced)</span>
        </OptionsCheckbox>
      </OptionsPlayer.Row>

      <div className="OptionsPlayerのbuttons">
        <OptionsButton onClick={this.props.onClose}>Save & Exit</OptionsButton>
      </div>
    </div>
  }
})

OptionsPlayer.Row = React.createClass({
  render () {
    return <div
      className="OptionsPlayerのrow"
      style={{ display: this.props.hidden ? 'none' : '' }}
    >
      <label>{this.props.label}</label>
      <div>{this.props.children}</div>
    </div>
  }
})

const OptionsLeadTimeInputField = withProps({
  parse: str => parseInt(str, 10),
  stringify: value => String(value) + 'ms',
  validator: /^\d+(ms)?$/
})(OptionsInputField)

export default enhance(OptionsPlayer)
