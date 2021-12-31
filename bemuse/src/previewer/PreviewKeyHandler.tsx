import { isModalActive } from 'bemuse/ui-dialogs'
import { useEffect } from 'react'
import { PreviewAction } from './PreviewState'

export const PreviewKeyHandler: React.FC<{
  dispatch: React.Dispatch<PreviewAction>
}> = (props) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalActive()) return
      console.log(e.key)
      if (e.key === 'ArrowUp') {
        props.dispatch({ speedUp: true })
        e.preventDefault()
      }
      if (e.key === 'ArrowDown') {
        props.dispatch({ speedDown: true })
        e.preventDefault()
      }
      if (e.key === ' ') {
        props.dispatch({ playPause: true })
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
