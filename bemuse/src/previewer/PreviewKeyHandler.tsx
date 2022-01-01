import { isModalActive } from 'bemuse/ui-dialogs'
import { useLatest } from 'bemuse/utils/useLatest'
import { useEffect } from 'react'
import { NotechartPreview } from './NotechartPreview'
import { PreviewAction } from './PreviewState'

let rememberedMeasureNumber: number | null = null

export const PreviewKeyHandler: React.FC<{
  notechartPreview: NotechartPreview
  dispatch: React.Dispatch<PreviewAction>
  onReload: () => void
}> = (props) => {
  const getLatestNotechartPreview = useLatest(props.notechartPreview)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalActive()) return
      console.log(e.key)
      if (e.key === '2') {
        props.dispatch({ speedUp: true })
        e.preventDefault()
      }
      if (e.key === '1') {
        props.dispatch({ speedDown: true })
        e.preventDefault()
      }
      if (e.key === ' ') {
        props.dispatch({ playPause: true })
        e.preventDefault()
      }
      if (e.key === 'Home') {
        props.dispatch({ home: true })
        e.preventDefault()
      }
      if (e.key === 'g') {
        props.dispatch({ pause: true })
        const measure = +(
          prompt(
            'Measure number',
            rememberedMeasureNumber ? `${rememberedMeasureNumber}` : ''
          ) || ''
        )
        if (!isNaN(measure)) {
          rememberedMeasureNumber = measure
          props.dispatch({
            jumpToTime: {
              time: getLatestNotechartPreview().measureToSeconds(measure),
            },
          })
        }
        e.preventDefault()
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        props.onReload()
        e.preventDefault()
      }
      if (e.key === 'ArrowDown') {
        props.dispatch({
          jumpByMeasure: {
            direction: -1,
            preview: getLatestNotechartPreview(),
          },
        })
        e.preventDefault()
      }
      if (e.key === 'ArrowUp') {
        props.dispatch({
          jumpByMeasure: {
            direction: 1,
            preview: getLatestNotechartPreview(),
          },
        })
        e.preventDefault()
      }
      if (e.key === 'ArrowLeft') {
        props.dispatch({
          jumpBySeconds: { direction: -5 },
        })
        e.preventDefault()
      }
      if (e.key === 'ArrowRight') {
        props.dispatch({
          jumpBySeconds: { direction: 5 },
        })
        e.preventDefault()
      }
      if (e.key === ',') {
        props.dispatch({
          jumpBySeconds: { direction: -1 / 10 },
        })
        e.preventDefault()
      }
      if (e.key === '.') {
        props.dispatch({
          jumpBySeconds: { direction: 1 / 10 },
        })
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [props.dispatch])
  return null
}
