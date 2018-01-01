import './OptionsPlayerSelector.scss'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'

import OptionsPlayerGraphics from './OptionsPlayerGraphics'

class OptionsPlayerSelector extends React.PureComponent {
  static propTypes = {
    onSelect: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })),
    type: PropTypes.string,
    value: PropTypes.string
  }

  render () {
    return (
      <div className='OptionsPlayerSelector'>
        {this.props.options.map((item, index) => (
          <OptionsPlayerSelector.Item
            key={index}
            type={this.props.type}
            value={item.value}
            label={item.label}
            active={item.value === this.props.value}
            onSelect={this.props.onSelect}
          />
        ))}
      </div>
    )
  }
}

class OptionsPlayerSelectorItem extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    onSelect: PropTypes.func,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string
  }

  render () {
    return (
      <div
        className={c('OptionsPlayerSelectorのitem', {
          'is-active': this.props.active
        })}
        onClick={this.handleClick}
      >
        <OptionsPlayerGraphics
          type={this.props.type}
          value={this.props.value}
          active={this.props.active}
        />
        <div className='OptionsPlayerSelectorのlabel'>{this.props.label}</div>
      </div>
    )
  }
  handleClick = () => {
    this.props.onSelect(this.props.value)
  }
}

OptionsPlayerSelector.Item = OptionsPlayerSelectorItem

export default OptionsPlayerSelector
