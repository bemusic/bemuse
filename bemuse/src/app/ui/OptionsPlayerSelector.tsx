import './OptionsPlayerSelector.scss'

import OptionsPlayerGraphics from './OptionsPlayerGraphics'
import React from 'react'
import c from 'classnames'

export interface OptionsPlayerSelectorProps<T extends string> {
  onSelect: (item: T) => void
  options: readonly {
    label: string
    value: T
  }[]
  type: string
  value: T
}

const OptionsPlayerSelector = <T extends string>({
  onSelect,
  options,
  type,
  value,
}: OptionsPlayerSelectorProps<T>) => (
  <div className='OptionsPlayerSelector'>
    {options.map((item, index) => (
      <OptionsPlayerSelector.Item
        key={index}
        type={type}
        value={item.value}
        label={item.label}
        active={item.value === value}
        onSelect={onSelect}
      />
    ))}
  </div>
)

export interface OptionsPlayerSelectorItemProps<T extends string> {
  active: boolean
  onSelect: (item: T) => void
  label: string
  type: string
  value: T
}

const OptionsPlayerSelectorItem = <T extends string>({
  active,
  onSelect,
  label,
  type,
  value,
}: OptionsPlayerSelectorItemProps<T>) => {
  const handleClick = () => {
    onSelect(value)
  }
  return (
    <div
      className={c('OptionsPlayerSelectorのitem', {
        'is-active': active,
      })}
      onClick={handleClick}
    >
      <OptionsPlayerGraphics type={type} value={value} active={active} />
      <div className='OptionsPlayerSelectorのlabel'>{label}</div>
    </div>
  )
}

OptionsPlayerSelector.Item = OptionsPlayerSelectorItem

export default OptionsPlayerSelector
