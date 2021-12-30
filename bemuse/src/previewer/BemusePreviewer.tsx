import './BemusePreviewer.scss'
import React, { useEffect, useState } from 'react'
import { PreviewCanvas } from './PreviewCanvas'
import { PreviewInfo } from './PreviewInfo'
import { PreviewFileDropHandler } from './PreviewFileDropHandler'
import { loadPreview, setPreview } from './PreviewLoader'
import { createNullNotechartPreview } from './NotechartPreview'

export const BemusePreviewer = () => {
  const [notechartPreview, setNotechartPreview] = useState(
    createNullNotechartPreview()
  )

  useEffect(() => {
    loadPreview().then(setNotechartPreview)
  }, [])

  const onDrop = async (handle: FileSystemDirectoryHandle) => {
    await setPreview(handle)
    loadPreview().then(setNotechartPreview)
  }

  return (
    <div className='BemusePreviewer'>
      <div className='BemusePreviewerのheader'>
        <h1>
          <strong>Bemuse</strong> BMS/bmson previewer
        </h1>
      </div>
      <div className='BemusePreviewerのmain'>
        <PreviewCanvas />
        <PreviewInfo notechartPreview={notechartPreview} />
        <PreviewFileDropHandler onDrop={onDrop} />
      </div>
    </div>
  )
}
