import './OptionsCheckbox.scss'

import React from 'react'

const OptionsCheckbox = ({
  checked,
  children,
  onToggle,
}: {
  checked: boolean
  children?: ReactNode
  onToggle: () => void
}) => {
  return (
    <span className='OptionsCheckbox'>
      <label>
        <input type='checkbox' checked={checked} onChange={onToggle} />
        <span className='OptionosCheckboxのレーベル'>{children}</span>
      </label>
    </span>
  )
}

export default OptionsCheckbox
