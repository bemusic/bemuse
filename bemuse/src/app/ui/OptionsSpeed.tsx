import './OptionsSpeed.scss'

import React, { memo } from 'react'

import OptionsButton from './OptionsButton'
import OptionsInputField from './OptionsInputField'

export interface OptionsSpeedProps {
  value: string
  onChange: (speed: string) => void
}

const parseSpeed = (speedString: string): number =>
  +(+speedString || 1.0).toFixed(1)

const stringifySpeed = (speed: number): string => speed.toFixed(1)

const tickAmount = (speed: number) => {
  if (speed > 0.5) {
    return 0.5
  }
  if (speed > 0.2) {
    return 0.3
  }
  return 0
}

const OptionsSpeed = ({ value, onChange }: OptionsSpeedProps) => {
  const handleMinusButtonClick = () => {
    const speed = parseSpeed(value)
    const nextSpeed = speed - tickAmount(speed)
    onChange(stringifySpeed(nextSpeed))
  }

  const handlePlusButtonClick = () => {
    const speed = parseSpeed(value)
    const nextSpeed = speed + tickAmount(speed)
    onChange(stringifySpeed(nextSpeed))
  }

  const handleSpeedInputChange = (nextSpeed: number) => {
    onChange(stringifySpeed(nextSpeed))
  }

  return (
    <div className='OptionsSpeed'>
      <span className='OptionsSpeedのminus'>
        <OptionsButton onClick={handleMinusButtonClick}>-</OptionsButton>
      </span>
      <OptionsInputField
        value={parseSpeed(value)}
        parse={parseSpeed}
        stringify={stringifySpeed}
        validator={/^\d+(?:\.\d)?$/}
        onChange={handleSpeedInputChange}
      />
      <span className='OptionsSpeedのplus'>
        <OptionsButton onClick={handlePlusButtonClick}>+</OptionsButton>
      </span>
    </div>
  )
}

export default memo(OptionsSpeed)
