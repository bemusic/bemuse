
import './options-speed-input.scss'
import React from 'react'

const OptionsSpeed = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  formatSpeed(speed) {
    return (+speed || 1.0).toFixed(1)
  },
  render() {
    return <input
        type="text"
        ref="input"
        defaultValue={this.formatSpeed(this.props.value)}
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
        className="options-speed-input" />
  },
  handleInputChange(e) {
    let input = e.target
    let valid = /^\d+(?:\.\d)?$/.test(input.value)
    input.classList[valid ? 'remove' : 'add']('is-invalid')
    if (valid) {
      this.props.onChange(+input.value)
    }
  },
  handleInputKeyDown(e) {
    if (e.key === 'ArrowDown') {
      this.props.onChange(+this.formatSpeed(this.props.value) - 0.1)
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      this.props.onChange(+this.formatSpeed(this.props.value) + 0.1)
      e.preventDefault()
    }
  },
  componentDidUpdate(previousProps, previousState) {
    if (this.formatSpeed(previousProps.value) !== this.formatSpeed(this.props.value)) {
      let input = React.findDOMNode(this.refs.input)
      let newValue = this.formatSpeed(this.props.value)
      if (+input.value !== +newValue) {
        input.value = newValue
      }
    }
  },
})

export default OptionsSpeed
