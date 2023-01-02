import './OptionsInputKeys.scss'

import OptionsInputKey from './OptionsInputKey'
import React from 'react'
import _ from 'lodash'

export interface OptionsInputKeysProps {
  texts: Record<string, string>
  editing: string | null
  onEdit: (text: string) => void
  keyboardMode: boolean
}

const OptionsInputKeys = ({
  texts,
  editing,
  onEdit,
  keyboardMode,
}: OptionsInputKeysProps) => (
  <div
    className='OptionsInputKeys'
    data-arrangement={keyboardMode ? 'kb' : 'bm'}
  >
    <div className='OptionsInputKeysのkeys'>
      {_.range(1, 8).map((i) => (
        <OptionsInputKey
          n={i}
          key={i}
          text={texts[i]}
          isEditing={'' + i === '' + editing}
          onEdit={() => onEdit('' + i)}
        />
      ))}
    </div>
  </div>
)

export default OptionsInputKeys
