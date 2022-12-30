import { useEffect } from 'react'

import * as MusicPreviewer from '.'

MusicPreviewer.preload()

export interface MusicSelectPreviewerProps {
  url: string | null
}

const MusicSelectPreviewer = ({ url }: MusicSelectPreviewerProps) => {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      if (data.type === 'calibration-started') {
        MusicPreviewer.disable()
      } else if (data.type === 'calibration-closed') {
        MusicPreviewer.enable()
      }
    }
    addEventListener('message', handleMessage)
    return () => {
      MusicPreviewer.disable()
      removeEventListener('message', handleMessage)
    }
  }, [])
  useEffect(() => {
    MusicPreviewer.enable()
    MusicPreviewer.preview(url)
  })

  return null
}

export default MusicSelectPreviewer
