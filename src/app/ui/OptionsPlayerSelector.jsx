
import './OptionsPlayerSelector.scss'
import React from 'react'
import c     from 'classnames'

import OptionsPlayerGraphics from './OptionsPlayerGraphics'

const OptionsPlayerSelector = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return <div className="OptionsPlayerSelector">
      {this.props.options.map((item, index) =>
          <OptionsPlayerSelector.Item
              key={index}
              type={this.props.type}
              value={item.value}
              label={item.label}
              active={item.value === this.props.value}
              onSelect={this.props.onSelect} />)}
    </div>
  }
})

OptionsPlayerSelector.Item = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return <div
        className={c('OptionsPlayerSelectorのitem',
            { 'is-active': this.props.active })}
        onClick={this.handleClick}>
      <OptionsPlayerGraphics
          type={this.props.type}
          value={this.props.value}
          active={this.props.active} />
      <div className="OptionsPlayerSelectorのlabel">
        {this.props.label}
      </div>
    </div>
  },
  handleClick() {
    this.props.onSelect(this.props.value)
  },
})

export default OptionsPlayerSelector
