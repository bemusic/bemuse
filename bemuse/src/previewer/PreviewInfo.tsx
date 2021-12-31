import './PreviewInfo.scss'
import React, { useMemo } from 'react'
import { MeasureInfo, NotechartPreview } from './NotechartPreview'
import { PreviewState } from './PreviewState'
import { BarDot } from './BarDot'

export const PreviewInfo: React.FC<{
  notechartPreview: NotechartPreview
  previewState: PreviewState
}> = (props) => {
  const preview = props.notechartPreview

  const measureInfo = useMemo(() => {
    return props.notechartPreview.getMeasureInfo(props.previewState.currentTime)
  }, [props.notechartPreview, props.previewState.currentTime])
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
  const formatTime = (s: number) => {
    return `${~~(s / 60)}:${(~~s % 60).toString().padStart(2, '0')}`
  }

  return (
    <div className='PreviewInfo'>
      <h2>{preview.name}</h2>
      <p>{preview.description}</p>
      <table>
        <col width={80} />
        <col width={120} />
        <col width={80} />
        <tbody>
          <tr>
            <th scope='row'>Time</th>
            <td colSpan={2}>
              {formatTime(props.previewState.currentTime)} /{' '}
              {formatTime(props.notechartPreview.duration)}
            </td>
          </tr>
          <tr>
            <th scope='row'>Measure</th>
            <td colSpan={2}>
              <BarDots measureInfo={measureInfo} /> #{measureInfo.measureNumber}
            </td>
          </tr>
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

const BarDots: React.FC<{ measureInfo: MeasureInfo }> = (props) => {
  const { measureInfo } = props
  if (!measureInfo.measureEndBeat) return null
  const measureSize = measureInfo.measureEndBeat - measureInfo.measureStartBeat
  if (!measureSize) return null
  let dotCount = measureSize
  let dotSize = 1
  while (dotCount >= 8) {
    dotSize *= 2
    dotCount /= 2
  }
  while (dotCount <= 2) {
    dotSize /= 2
    dotCount *= 2
  }
  const dots: React.ReactNode[] = []
  let filledDots = Math.ceil(
    (measureInfo.currentBeat - measureInfo.measureStartBeat) / dotSize
  )
  while (dotCount > 0) {
    dots.push(
      <BarDot
        key={dots.length}
        fraction={dotCount > 1 ? 1 : dotCount}
        fill={filledDots > 0 ? '#e34e7a' : '#333'}
      />
    )
    dotCount--
    filledDots--
  }
  return <>{dots}</>
}
