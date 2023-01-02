import './OptionsInputField.scss'

import React, { ChangeEvent, ComponentProps, useRef } from 'react'

import _ from 'lodash'

export interface OptionsInputFieldProps<T> {
  stringify: (x: T) => string
  parse: (x: string) => T
  onChange: (newValue: T) => void
  validator: {
    test: (x: string) => boolean
  }
  value: T
}

export const defaultProps: Partial<OptionsInputFieldProps<string>> = {
  stringify: (x) => `${x}`,
  parse: (x) => x,
  onChange: () => {},
}

const OptionsInputField = <T,>(
  props: OptionsInputFieldProps<T> &
    Omit<ComponentProps<'input'>, keyof OptionsInputFieldProps<T>>
) => {
  const { stringify, parse, onChange, validator, value } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const valid = validator.test(input.value)
    input.classList[valid ? 'remove' : 'add']('is-invalid')
    if (valid) {
      onChange(parse(input.value))
    }
  }
  const handleInputBlur = () => {
    const input = inputRef.current
    if (!input) {
      return
    }
    input.value = stringify(value)
    input.classList.remove('is-invalid')
  }
  return (
    <input
      {..._.omit(props, [
        'stringify',
        'parse',
        'onChange',
        'validator',
        'value',
      ])}
      type='text'
      ref={inputRef}
      value={stringify(value)}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      className='OptionsInputField'
    />
  )
}

export default OptionsInputField
