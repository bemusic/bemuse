import * as MusicPreviewer from '.'

import { useEffect, useState } from 'react'

MusicPreviewer.preload()

export interface MusicSelectPreviewerProps {
  url: string | null
}

const MusicSelectPreviewer = ({ url }: MusicSelectPreviewerProps) => {
  const [pausedForCalibration, setPausedForCalibration] = useState(false)
  useEffect(() => {
    const handleMessage = ({ data, origin }: MessageEvent) => {
      if (origin !== 'https://bemuse.ninja') {
        throw new Error('invalid origin')
      }
      if (data.type === 'calibration-started') {
        setPausedForCalibration(true)
      }
      if (data.type === 'calibration-closed') {
        setPausedForCalibration(false)
      }
    }
    addEventListener('message', handleMessage)
    return () => {
      MusicPreviewer.disable()
      removeEventListener('message', handleMessage)
    }
  }, [])
  useEffect(() => {
    if (pausedForCalibration) {
      MusicPreviewer.disable()
    } else {
      MusicPreviewer.enable()
    }
    MusicPreviewer.preview(url)
  }, [url, pausedForCalibration])

  return null
}

export default MusicSelectPreviewer
