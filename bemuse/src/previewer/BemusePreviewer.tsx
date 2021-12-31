import './BemusePreviewer.scss'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { PreviewCanvas } from './PreviewCanvas'
import { PreviewInfo } from './PreviewInfo'
import { PreviewFileDropHandler } from './PreviewFileDropHandler'
import { loadPreview, setPreview } from './PreviewLoader'
import {
  createNullNotechartPreview,
  NotechartPreview,
  NotechartPreviewPlayer,
} from './NotechartPreview'
import {
  PreviewAction,
  PreviewState,
  previewStateReducer,
} from './PreviewState'
import { PreviewKeyHandler } from './PreviewKeyHandler'

export const BemusePreviewer = () => {
  const [previewState, dispatch] = useReducer(previewStateReducer, {
    currentTime: 50,
    hiSpeed: 1,
    playing: false,
  })

  const [notechartPreview, setNotechartPreview] = useState(
    createNullNotechartPreview
  )

  usePreviewPlayer(previewState, dispatch, notechartPreview)

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
        <PreviewCanvas
          notechartPreview={notechartPreview}
          previewState={previewState}
        />
        <PreviewInfo
          notechartPreview={notechartPreview}
          previewState={previewState}
        />
        <PreviewFileDropHandler onDrop={onDrop} />
        <PreviewKeyHandler dispatch={dispatch} />
      </div>
    </div>
  )
}

function usePreviewPlayer(
  state: PreviewState,
  dispatch: React.Dispatch<PreviewAction>,
  notechartPreview: NotechartPreview
) {
  const playerRef = useRef<NotechartPreviewPlayer | null>(null)

  useEffect(() => {
    if (state.playing && playerRef.current === null) {
      playerRef.current = notechartPreview.play({
        startTime: state.currentTime,
        onFinish: () => {
          console.log('finish')
          dispatch({ playFinish: true })
        },
        onTimeUpdate: (t) => {
          console.log('time update', t)
          dispatch({ updateTime: { time: t } })
        },
      })
    } else if (!state.playing && playerRef.current !== null) {
      playerRef.current.stop()
      playerRef.current = null
    }
  }, [state])
}
