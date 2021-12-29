import './BemusePreviewer.scss'
import React from 'react'
import { PreviewCanvas } from './PreviewCanvas'
import { PreviewInfo } from './PreviewInfo'
import { PreviewFileDropHandler } from './PreviewFileDropHandler'

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
