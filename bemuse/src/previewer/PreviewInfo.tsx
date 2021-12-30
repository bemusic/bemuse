import './PreviewInfo.scss'
import React from 'react'

export const PreviewInfo = () => {
  return (
    <div className='PreviewInfo'>
      <h2>No BMS/bmson loaded</h2>
      <p>Drop a folder with BMS/bmson files into this window to preview it.</p>
      <p className='PreviewInfoのkeyHints'>
        <kbd>Space</kbd> Play/Pause &middot; <kbd>Left/Right</kbd> Seek &middot;{' '}
        <kbd>Up/Down</kbd> Hi-Speed &middot; <kbd>R</kbd> Reload
      </p>
    </div>
  )
}
