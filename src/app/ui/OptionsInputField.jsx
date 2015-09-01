
import './OptionsInputField.scss'
import React from 'react'
import _ from 'lodash'

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    stringify: React.PropTypes.func,
    parse: React.PropTypes.func,
    onChange: React.PropTypes.func,
    validator: React.PropTypes.object,
    value: React.PropTypes.any,
  },
  getDefaultProps() {
    return {
      stringify: x => `${x}`,
      parse:     x => x,
      onChange: () => {},
    }
  },
  render() {
    return <input
        {..._.omit(this.props, ['stringify', 'parse', 'onChange', 'validator', 'value'])}
        type="text"
        ref="input"
        defaultValue={this.props.stringify(this.props.value)}
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
        onBlur={this.handleInputBlur}
        className="OptionsInputField" />
  },
  handleInputChange(e) {
    let input = e.target
    let valid = this.props.validator.test(input.value)
    input.classList[valid ? 'remove' : 'add']('is-invalid')
    if (valid) {
      this.props.onChange(this.props.parse(input.value))
    }
  },
  handleInputBlur() {
    let input = React.findDOMNode(this.refs.input)
    input.value = this.props.stringify(this.props.value)
    input.classList.remove('is-invalid')
  },
  componentDidUpdate(previousProps, previousState) {
    let newValue = this.props.stringify(this.props.value)
    if (this.props.stringify(previousProps.value) !== newValue) {
      let input = React.findDOMNode(this.refs.input)
      if (this.props.parse(input.value) !== this.props.parse(newValue)) {
        input.value = newValue
      }
    }
  },
})
