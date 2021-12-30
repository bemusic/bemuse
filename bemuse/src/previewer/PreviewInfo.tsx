import './PreviewInfo.scss'
import React, { useMemo } from 'react'
import { NotechartPreview } from './NotechartPreview'
import { PreviewState } from './PreviewState'

export const PreviewInfo: React.FC<{
  notechartPreview: NotechartPreview
  previewState: PreviewState
}> = (props) => {
  const preview = props.notechartPreview

  const bpm = useMemo(() => {
    return props.notechartPreview.getCurrentBpm(props.previewState.currentTime)
  }, [props.notechartPreview, props.previewState.currentTime])

  return (
    <div className='PreviewInfo'>
      <h2>{preview.name}</h2>
      <p>{preview.description}</p>
      <p>BPM: {bpm}</p>
      <p className='PreviewInfoのkeyHints'>
        <kbd>Space</kbd> Play/Pause &middot; <kbd>Left/Right</kbd> Seek &middot;{' '}
        <kbd>Up/Down</kbd> Hi-Speed &middot; <kbd>R</kbd> Reload
      </p>
    </div>
  )
}
