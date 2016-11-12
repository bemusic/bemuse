import * as Options from '../entities/Options'
import * as OptionsIO from '../io/OptionsIO'
import './OptionsPlayer.scss'

import compose from 'recompose/compose'
import React from 'react'
import { connect } from 'react-redux'

import connectIO from '../../impure-react/connectIO'
import OptionsButton from './OptionsButton'
import OptionsCheckbox from './OptionsCheckbox'
import OptionsInputField from './OptionsInputField'
import OptionsPlayerSelector from './OptionsPlayerSelector'
import OptionsSpeed from './OptionsSpeed'

const SettingRow = compose(
  connect((state) => ({ options: state.options })),
  connectIO({ onUpdateOptions: () => (updater) => OptionsIO.updateOptions(updater) }),
)((props) => {
  const { label, isVisible, help, renderControl } = props // user-supplied
  const { options, onUpdateOptions } = props // from higher-order component
  const visible = isVisible ? isVisible(options) : true
  const control = renderControl(options, onUpdateOptions)
  return (
    <OptionsPlayer.Row label={label} hidden={!visible}>
      {control}
      {!!help && <div className="OptionsPlayerのhelp">{help}</div>}
    </OptionsPlayer.Row>
  )
})

export const OptionsPlayer = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func
  },
  render () {
    return <div className="OptionsPlayer">
      <SettingRow
        label="Speed"
        isVisible={(options) => !Options.isAutoVelocityEnabled(options)}
        renderControl={(options, onUpdateOptions) => (
          <OptionsSpeed
            value={Options.speed(options)}
            onChange={(speed) => onUpdateOptions(Options.changeSpeed(speed))}
          />
        )}
        help={<span>
          You can also change the speed in-game<br />using the Up and Down arrow keys.
        </span>}
      />

      <SettingRow
        label="LeadTime"
        isVisible={(options) => Options.isAutoVelocityEnabled(options)}
        renderControl={(options, onUpdateOptions) => (
          <OptionsInputField
            parse={str => parseInt(str, 10)}
            stringify={value => String(value) + 'ms'}
            validator={/^\d+(ms)?$/}
            value={Options.leadTime(options)}
            onChange={(leadTime) => onUpdateOptions(Options.changeLeadTime(leadTime))}
            style={{ width: '5em' }}
          />
        )}
        help={<span>
          Speed will be automatically adjusted<br />to maintain a consistent note velocity.
        </span>}
      />

      <SettingRow
        label="Scratch"
        renderControl={(options, onUpdateOptions) => (
          <OptionsPlayerSelector type="scratch"
            options={[
              { value: 'left', label: 'Left', },
              { value: 'right', label: 'Right', },
              { value: 'off', label: 'Disabled', },
            ]}
            value={Options.scratchPosition(options)}
            onSelect={(position) => onUpdateOptions(Options.changeScratchPosition(position))}
          />
        )}
      />

      <SettingRow
        label="Panel"
        renderControl={(options, onUpdateOptions) => (
          <OptionsPlayerSelector type="panel"
            options={[
              { value: 'left', label: 'Left', },
              { value: 'center', label: 'Center', },
              { value: 'right', label: 'Right', },
            ]}
            onSelect={(value) => onUpdateOptions(Options.changePanelPlacement(value))}
            value={Options.panelPlacement(options)}
          />
        )}
      />

      <SettingRow
        label="Cover"
        renderControl={(options, onUpdateOptions) => (
          <OptionsInputField
            parse={str => parseInt(str, 10) / 100}
            stringify={value => Math.round(value * 100 || 0) + '%'}
            validator={/^-?\d+(%)?$/}
            value={Options.laneCover(options)}
            onChange={(laneCover) => onUpdateOptions(Options.changeLaneCover(laneCover))}
            style={{ width: '5em' }}
          />
        )}
      />

      <SettingRow
        label="BGA"
        renderControl={(options, onUpdateOptions) => (
          <OptionsCheckbox
            checked={Options.isBackgroundAnimationsEnabled(options)}
            onToggle={() => onUpdateOptions(Options.toggleBackgroundAnimations)}
          >
            Enable background animations <span className="OptionsPlayerのhint">(720p, alpha)</span>
          </OptionsCheckbox>
        )}
      />

      <SettingRow
        label="AutoVel"
        renderControl={(options, onUpdateOptions) => (
          <OptionsCheckbox
            checked={Options.isAutoVelocityEnabled(options)}
            onToggle={() => onUpdateOptions(Options.toggleAutoVelocity)}
          >
            Maintain absolute note velocity <span className="OptionsPlayerのhint">(advanced)</span>
          </OptionsCheckbox>
        )}
      />

      <SettingRow
        label="Gauge"
        renderControl={(options, onUpdateOptions) => (
          <OptionsCheckbox
            checked={Options.isGaugeEnabled(options)}
            onToggle={() => onUpdateOptions(Options.toggleGauge)}
          >
            Show expert gauge <span className="OptionsPlayerのhint">(experimental)</span>
          </OptionsCheckbox>
        )}
      />

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

export default OptionsPlayer
