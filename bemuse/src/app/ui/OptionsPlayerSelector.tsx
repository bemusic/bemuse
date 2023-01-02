import './OptionsPlayerSelector.scss'

import React, { memo } from 'react'

import OptionsPlayerGraphics from './OptionsPlayerGraphics'
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

const OptionsPlayerSelectorInner = <T extends string>({
  onSelect,
  options,
  type,
  value,
}: OptionsPlayerSelectorProps<T>) => (
  <div className='OptionsPlayerSelector'>
    {options.map((item, index) => (
      <OptionsPlayerSelectorItem
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

export const OptionsPlayerSelector = memo(
  OptionsPlayerSelectorInner
) as typeof OptionsPlayerSelectorInner

export interface OptionsPlayerSelectorItemProps<T extends string> {
  active: boolean
  onSelect: (item: T) => void
  label: string
  type: string
  value: T
}

const OptionsPlayerSelectorItemInner = <T extends string>({
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

const OptionsPlayerSelectorItem = memo(
  OptionsPlayerSelectorItemInner
) as typeof OptionsPlayerSelectorItemInner
