import './BemusePreviewer.scss'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { PreviewCanvas } from './PreviewCanvas'
import { PreviewInfo } from './PreviewInfo'
import { PreviewFileDropHandler } from './PreviewFileDropHandler'
import { getSavedPreviewInfo, loadPreview, setPreview } from './PreviewLoader'
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
import { showAlert, showQuickPick } from 'bemuse/ui-dialogs'
import _ from 'lodash'

export const BemusePreviewer = () => {
  const div = useRef<HTMLDivElement>(null)
  const [previewState, dispatch] = useReducer(previewStateReducer, {
    currentTime: 0,
    hiSpeed: 1,
    playing: false,
  })

  const [notechartPreview, setNotechartPreview] = useState(
    createNullNotechartPreview
  )

  const [loading, setLoading] = useState<null | string>(null)

  const reload = () => {
    setLoading('Loading...')
    const setLoadingDebounced = _.throttle(setLoading, 100)
    loadPreview({
      log: (message) => {
        setLoadingDebounced((x) => (x != null ? message : x))
      },
    })
      .then((preview) => {
        setNotechartPreview(preview)
        dispatch({ loaded: true })
        if (div.current) {
          div.current.focus()
        }
      })
      .catch((error) => {
        console.error(error)
        showAlert('Error loading preview', String(error))
      })
      .finally(() => setLoadingDebounced(null))
  }

  usePreviewPlayer(previewState, dispatch, notechartPreview)

  useEffect(() => {
    ;(async () => {
      const savedPreviewInfo = await getSavedPreviewInfo()
      if (savedPreviewInfo) {
        const choices: { label: string; action: () => void }[] = [
          {
            label: `Load ${savedPreviewInfo.chartFilename}`,
            action: () => {
              reload()
            },
          },
          {
            label: 'Do not load',
            action: () => {},
          },
        ]
        const chosenChoice = await showQuickPick(choices, {
          title: 'Load a recent song?',
        })
        chosenChoice.action()
      }
    })()
  }, [])

  const onDrop = async (
    handle: FileSystemDirectoryHandle,
    selectedChartFilename: string
  ) => {
    await setPreview(handle, selectedChartFilename)
    reload()
  }

  const onReload = () => {
    reload()
  }

  return (
    <div className='BemusePreviewer' tabIndex={0} ref={div}>
      <div className='BemusePreviewerのheader'>
        <h1>
          <strong>Bemuse</strong>’s BMS/bmson previewer
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
        <PreviewKeyHandler
          notechartPreview={notechartPreview}
          dispatch={dispatch}
          onReload={onReload}
        />
      </div>
      {loading != null ? (
        <div className='BemusePreviewerのloading'>{loading}</div>
      ) : null}
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
          dispatch({ playFinish: true })
        },
        onTimeUpdate: (t) => {
          dispatch({ updateTime: { time: t } })
        },
      })
    } else if (!state.playing && playerRef.current !== null) {
      playerRef.current.stop()
      playerRef.current = null
    }
  }, [state])
}
