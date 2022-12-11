import './OptionsInputKey.scss'

import React from 'react'
import c from 'classnames'

export interface OptionsInputKeyProps {
  text: string
  n: number
  isEditing: boolean
  onEdit: () => void
}

export const OptionsInputKey = ({
  text,
  n,
  isEditing,
  onEdit,
}: OptionsInputKeyProps) => {
  return (
    <div className='OptionsInputKey' data-n={n}>
      <div
        className={c('OptionsInputKeyのcontents', {
          'is-editing': isEditing,
        })}
        onClick={onEdit}
      >
        <div className='OptionsInputKeyのtext'>{text}</div>
      </div>
    </div>
  )
}

export default OptionsInputKey
