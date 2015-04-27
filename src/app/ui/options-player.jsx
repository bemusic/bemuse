
import './options-player.scss'
import React from 'react'

import * as Options          from '../options'
import OptionsPlayerSelector from './options-player-selector'
import OptionsButton         from './options-button'

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

const OptionsPlayer = React.createClass({
  render() {
    return <div className="options-player">

      <OptionsPlayer.Row label="Speed">
        For now, set the speed in-game<br />
        using Up and Down arrow.
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Scratch">
        <OptionsPlayerSelector type="scratch"
            options={SCRATCH_OPTIONS}
            onSelect={this.handleSelectScratch}
            value={Options.get('player.P1.scratch')} />
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Panel">
        <OptionsPlayerSelector type="panel"
            options={PANEL_OPTIONS}
            onSelect={this.handleSelectPanel}
            value={Options.get('player.P1.panel')} />
      </OptionsPlayer.Row>

      <div className="options-player--buttons">
        <OptionsButton onClick={this.props.onClose}>Save & Exit</OptionsButton>
      </div>

    </div>
  },
  handleSelectPanel(value) {
    Options.set('player.P1.panel', value)
    this.forceUpdate()
  },
  handleSelectScratch(value) {
    Options.set('player.P1.scratch', value)
    this.forceUpdate()
  },
})

OptionsPlayer.Row = React.createClass({
  render() {
    return <div className="options-player--row">
      <label>{this.props.label}</label>
      <div>{this.props.children}</div>
    </div>
  }
})

export default OptionsPlayer
