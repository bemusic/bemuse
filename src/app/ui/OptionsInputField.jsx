
import './OptionsInputField.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import pure from 'recompose/pure'

class OptionsInputField extends React.PureComponent {
  static propTypes = {
    stringify: PropTypes.func,
    parse: PropTypes.func,
    onChange: PropTypes.func,
    validator: PropTypes.object,
    value: PropTypes.any,
  }
  static defaultProps = {
    stringify: x => `${x}`,
    parse:     x => x,
    onChange: () => {},
  }

  constructor () {
    super()
  }

  render () {
    return <input
      {..._.omit(this.props, ['stringify', 'parse', 'onChange', 'validator', 'value'])}
      type="text"
      ref="input"
      defaultValue={this.props.stringify(this.props.value)}
      onChange={() => this.handleInputChange()}
      onKeyDown={() => this.handleInputKeyDown()}
      onBlur={() => this.handleInputBlur()}
      className="OptionsInputField" />
  }
  handleInputChange (e) {
    let input = e.target
    let valid = this.props.validator.test(input.value)
    input.classList[valid ? 'remove' : 'add']('is-invalid')
    if (valid) {
      this.props.onChange(this.props.parse(input.value))
    }
  }
  handleInputBlur () {
    let input = ReactDOM.findDOMNode(this.refs.input)
    input.value = this.props.stringify(this.props.value)
    input.classList.remove('is-invalid')
  }
  componentDidUpdate (previousProps, previousState) {
    let newValue = this.props.stringify(this.props.value)
    if (this.props.stringify(previousProps.value) !== newValue) {
      let input = ReactDOM.findDOMNode(this.refs.input)
      if (this.props.parse(input.value) !== this.props.parse(newValue)) {
        if (document.activeElement !== input) {
          input.value = newValue
        }
      }
    }
  }
}

export default OptionsInputField
