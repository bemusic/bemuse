import './PreviewInfo.scss'
import React from 'react'
import { NotechartPreview } from './NotechartPreview'

export const PreviewInfo: React.FC<{ notechartPreview: NotechartPreview }> = (
  props
) => {
  const preview = props.notechartPreview
  return (
    <div className='PreviewInfo'>
      <h2>{preview.name}</h2>
      <p>{preview.description}</p>
      <p className='PreviewInfoのkeyHints'>
        <kbd>Space</kbd> Play/Pause &middot; <kbd>Left/Right</kbd> Seek &middot;{' '}
        <kbd>Up/Down</kbd> Hi-Speed &middot; <kbd>R</kbd> Reload
      </p>
    </div>
  )
}
