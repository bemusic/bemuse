
import './OptionsSpeed.scss'
import OptionsButton from './OptionsButton'
import OptionsInputField from './OptionsInputField'
import React from 'react'

const OptionsSpeed = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  parseSpeed (speedString) {
    return +(+speedString || 1.0).toFixed(1)
  },
  stringifySpeed (speed) {
    return speed.toFixed(1)
  },
  handleMinusButtonClick () {
    let speed = this.parseSpeed(this.props.value)
    let nextSpeed = speed - (speed > 0.5 ? 0.5 : speed > 0.2 ? 0.3 : 0)
    this.props.onChange(this.stringifySpeed(nextSpeed))
  },
  handlePlusButtonClick () {
    let speed = this.parseSpeed(this.props.value)
    let nextSpeed = speed + (speed < 0.5 ? 0.3 : 0.5)
    this.props.onChange(this.stringifySpeed(nextSpeed))
  },
  handleSpeedInputChange (nextSpeed) {
    this.props.onChange(this.stringifySpeed(nextSpeed))
  },
  render () {
    return <div className="OptionsSpeed">
      <span className="OptionsSpeedのminus">
        <OptionsButton onClick={this.handleMinusButtonClick}>-</OptionsButton>
      </span>
      <OptionsInputField
          value={this.parseSpeed(this.props.value)}
          parse={this.parseSpeed}
          stringify={this.stringifySpeed}
          validator={/^\d+(?:\.\d)?$/}
          onChange={this.handleSpeedInputChange} />
      <span className="OptionsSpeedのplus">
        <OptionsButton onClick={this.handlePlusButtonClick}>+</OptionsButton>
      </span>
    </div>
  },
})

export default OptionsSpeed
