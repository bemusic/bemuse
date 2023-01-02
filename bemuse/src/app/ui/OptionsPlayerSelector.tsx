import './OptionsPlayerSelector.scss'

import React, { memo } from 'react'

import c from 'classnames'

export interface OptionsPlayerSelectorProps<T extends string> {
  onSelect: (item: T) => void
  options: readonly {
    label: string
    value: T
  }[]
  defaultValue: T
  Item: (props: { active: boolean; value: T }) => JSX.Element
}

const OptionsPlayerSelectorInner = <T extends string>({
  onSelect,
  options,
  defaultValue,
  Item,
}: OptionsPlayerSelectorProps<T>) => (
  <div className='OptionsPlayerSelector'>
    {options.map(({ label, value }, index) => {
      const isActive = value === defaultValue
      return (
        <ItemContainer
          key={index}
          label={label}
          active={isActive}
          onSelect={() => onSelect(value)}
        >
          <Item active={isActive} value={value} />
        </ItemContainer>
      )
    })}
  </div>
)

export const OptionsPlayerSelector = memo(
  OptionsPlayerSelectorInner
) as typeof OptionsPlayerSelectorInner

interface ItemContainerProps {
  active: boolean
  onSelect: () => void
  label: string
  children: ReactNode
}

const ItemContainer = memo(
  ({ active, onSelect, label, children }: ItemContainerProps) => (
    <div
      className={c('OptionsPlayerSelectorのitem', {
        'is-active': active,
      })}
      onClick={onSelect}
    >
      {children}
      <div className='OptionsPlayerSelectorのlabel'>{label}</div>
    </div>
  )
)
