import './BemusePreviewer.scss'
import React, { useEffect } from 'react'
import { PreviewCanvas } from './PreviewCanvas'

export const PreviewInfo = () => {
  return (
    <div className='PreviewInfo'>
      <h2>No BMS/bmson loaded</h2>
      <p>Drop a folder with BMS/bmson files into this window to preview it.</p>
      <p className='PreviewInfoのkeyHints'>
        <kbd>Space</kbd> Play/Pause &middot; <kbd>Left/Right</kbd> Seek &middot;{' '}
        <kbd>Up/Down</kbd> Hi-Speed &middot;{' '}
      </p>
    </div>
  )
}

export const PreviewFileDropHandler = () => {
  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
    }
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
    }
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
    }
  }, [])
  return null
}

export const BemusePreviewer = () => {
  return (
    <div className='BemusePreviewer'>
      <div className='BemusePreviewerのheader'>
        <h1>
          <strong>Bemuse</strong> BMS/bmson previewer
        </h1>
      </div>
      <div className='BemusePreviewerのmain'>
        <PreviewCanvas />
        <PreviewInfo />
        <PreviewFileDropHandler />
      </div>
    </div>
  )
}
