
import './options-player.scss'
import React from 'react'

import { Binding }           from 'bemuse/flux'
import Store                 from '../stores/options-store'
import * as Actions         from '../actions/options-actions'
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
  mixins: [React.addons.PureRenderMixin],
  render() {
    return <div className="options-player">

      <Binding store={Store} onChange={this.handleState} />

      <OptionsPlayer.Row label="Speed">
        For now, set the speed in-game<br />
        using Up and Down arrow.
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Scratch">
        <OptionsPlayerSelector type="scratch"
            options={SCRATCH_OPTIONS}
            onSelect={this.handleSelectScratch}
            value={this.state.scratch} />
      </OptionsPlayer.Row>

      <OptionsPlayer.Row label="Panel">
        <OptionsPlayerSelector type="panel"
            options={PANEL_OPTIONS}
            onSelect={this.handleSelectPanel}
            value={this.state.options['player.P1.panel']} />
      </OptionsPlayer.Row>

      <div className="options-player--buttons">
        <OptionsButton onClick={this.props.onClose}>Save & Exit</OptionsButton>
      </div>

    </div>
  },
  getInitialState() {
    return Store.get()
  },
  handleState(state) {
    this.setState(state)
  },
  handleSelectPanel(value) {
    Actions.setOptions({ 'player.P1.panel': value })
  },
  handleSelectScratch(value) {
    Actions.setScratch(value)
  },
})

OptionsPlayer.Row = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return <div className="options-player--row">
      <label>{this.props.label}</label>
      <div>{this.props.children}</div>
    </div>
  }
})

export default OptionsPlayer
