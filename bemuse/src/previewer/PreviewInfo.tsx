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
  const scroll = useMemo(() => {
    return props.notechartPreview.getCurrentScroll(
      props.previewState.currentTime
    )
  }, [props.notechartPreview, props.previewState.currentTime])
  const speed = useMemo(() => {
    return props.notechartPreview.getCurrentSpeed(
      props.previewState.currentTime
    )
  }, [props.notechartPreview, props.previewState.currentTime])
  const hiSpeed = props.previewState.hiSpeed
  const format = (n: number) => n.toFixed(2)

  return (
    <div className='PreviewInfo'>
      <h2>{preview.name}</h2>
      <p>{preview.description}</p>
      <table>
        <tbody>
          <tr>
            <th scope='row'>#BPM</th>
            <td />
            <td>{format(bpm)}</td>
          </tr>
          <tr>
            <th scope='row'>#SCROLL</th>
            <td>{format(scroll)}x &rarr;</td>
            <td>{format(bpm * scroll)}</td>
          </tr>
          <tr>
            <th scope='row'>#SPEED</th>
            <td>{format(speed)}x &rarr;</td>
            <td>{format(bpm * scroll * speed)}</td>
          </tr>
          <tr>
            <th scope='row'>HI-SPEED</th>
            <td>{format(hiSpeed)}x &rarr;</td>
            <td>{format(bpm * scroll * speed * hiSpeed)}</td>
          </tr>
        </tbody>
      </table>
      <p className='PreviewInfoのkeyHints'>
        <kbd>Space</kbd> Play/Pause &middot; <kbd>Left/Right</kbd> Seek &middot;{' '}
        <kbd>Up/Down</kbd> Hi-Speed &middot; <kbd>R</kbd> Reload
      </p>
    </div>
  )
}
