
import './options-player-selector.scss'
import React from 'react'
import c     from 'classnames'

import OptionsPlayerGraphics from './options-player-graphics'

const OptionsPlayerSelector = React.createClass({
  render() {
    return <div className="options-player-selector">
      {this.props.options.map(item =>
          <OptionsPlayerSelector.Item
              type={this.props.type}
              value={item.value}
              label={item.label}
              active={item.value === this.props.value}
              onSelect={this.props.onSelect} />)}
    </div>
  }
})

OptionsPlayerSelector.Item = React.createClass({
  render() {
    return <div
        className={c('options-player-selector--item',
            { 'is-active': this.props.active })}
        onClick={this.handleClick}>
      <OptionsPlayerGraphics
          type={this.props.type}
          value={this.props.value}
          active={this.props.active} />
      <div className="options-player-selector--label">
        {this.props.label}
      </div>
    </div>
  },
  handleClick() {
    this.props.onSelect(this.props.value)
  },
})

export default OptionsPlayerSelector
