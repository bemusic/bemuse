
import './options-speed.scss'
import OptionsButton from './options-button'
import OptionsSpeedInput from './options-speed-input'
import React from 'react'

const OptionsSpeed = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  parseSpeed(speedString) {
    return +(+speedString || 1.0).toFixed(1)
  },
  stringifySpeed(speed) {
    return speed.toFixed(1)
  },
  handleMinusButtonClick() {
    let speed = this.parseSpeed(this.props.value)
    let nextSpeed = speed - (speed > 0.5 ? 0.5 : speed > 0.2 ? 0.3 : 0)
    this.props.onChange(this.stringifySpeed(nextSpeed))
  },
  handlePlusButtonClick() {
    let speed = this.parseSpeed(this.props.value)
    let nextSpeed = speed + (speed < 0.5 ? 0.3 : 0.5)
    this.props.onChange(this.stringifySpeed(nextSpeed))
  },
  handleSpeedInputChange(nextSpeed) {
    this.props.onChange(this.stringifySpeed(nextSpeed))
  },
  render() {
    return <div className="options-speed">
      <span className="options-speed--minus">
        <OptionsButton onClick={this.handleMinusButtonClick}>-</OptionsButton>
      </span>
      <OptionsSpeedInput
          value={this.props.value}
          onChange={this.handleSpeedInputChange} />
      <span className="options-speed--plus">
        <OptionsButton onClick={this.handlePlusButtonClick}>+</OptionsButton>
      </span>
    </div>
  },
})

export default OptionsSpeed
