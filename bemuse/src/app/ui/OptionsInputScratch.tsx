import './OptionsInputScratch.scss'

import React from 'react'
import c from 'classnames'

export interface OptionsInputScratchProps {
  text: readonly [string, string]
  editIndex: number
  isEditing: boolean
  onEdit: (text: string) => void
}

const keyClass = (editIndex: number, index: number) =>
  c('OptionsInputScratchのkey', {
    'is-editing': editIndex === index,
  })

const OptionsInputScratch = ({
  text,
  editIndex,
  isEditing,
  onEdit,
}: OptionsInputScratchProps) => (
  <div
    className={c('OptionsInputScratch', {
      'is-editing': isEditing,
    })}
    onClick={() => onEdit('SC')}
  >
    <svg viewBox='-100 -100 200 200'>
      <path d={star()} className='OptionsInputScratchのstar' />
    </svg>
    <div className='OptionsInputScratchのtext'>
      <div className={keyClass(editIndex, 0)}>{text[0]}</div>
      <div className='OptionsInputScratchのkeySeparator'>or</div>
      <div className={keyClass(editIndex, 1)}>{text[1]}</div>
    </div>
  </div>
)

export default OptionsInputScratch

function star() {
  let out = ''
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 40 : 90
    const θ = (i * Math.PI) / 5
    const x = Math.sin(θ) * r
    const y = Math.cos(θ) * r
    out += (i === 0 ? 'M' : ' L') + x + ',' + y
  }
  return out
}
