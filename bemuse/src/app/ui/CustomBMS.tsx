import './CustomBMS.scss'

import * as Analytics from '../analytics'
import * as CustomSongsIO from '../io/CustomSongsIO'

import React, { DragEventHandler, useEffect, useRef, useState } from 'react'
import {
  consumePendingArchiveURL,
  hasPendingArchiveToLoad,
} from '../PreloadedCustomBMS'

import Panel from 'bemuse/ui/Panel'
import { Song } from 'bemuse/collection-model/types'
import c from 'classnames'
import { customSongLoader } from '../io/customSongLoader'
import { useCustomSongLoaderLog } from '../CustomSongs'
import { useDispatch } from 'react-redux'

export interface CustomBMSProps {
  onSongLoaded?: (song: Song) => void
}

const CustomBMS = ({ onSongLoaded }: CustomBMSProps) => {
  const log = useCustomSongLoaderLog()
  const [hover, setHover] = useState(false)
  const dropzoneInput = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch()

  const onFileDrop = CustomSongsIO.handleCustomSongFolderDrop({
    customSongLoader,
    dispatch,
  })
  const loadFromURL = CustomSongsIO.handleCustomSongURLLoad({
    customSongLoader,
    dispatch,
  })
  const onFileSelect = CustomSongsIO.handleCustomSongFileSelect({
    customSongLoader,
    dispatch,
  })

  useEffect(() => {
    const onPaste = CustomSongsIO.handleClipboardPaste({
      customSongLoader,
      dispatch,
    })
    const handlePaste = async (e: Event) => {
      const song = await onPaste(e as ClipboardEvent)
      if (song) {
        if (onSongLoaded) onSongLoaded(song)
      }
    }
    window.addEventListener('paste', handlePaste)
    if (hasPendingArchiveToLoad()) {
      loadFromURL(consumePendingArchiveURL()!).then((song) => {
        if (song && onSongLoaded) onSongLoaded(song)
      })
    }
    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [])

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
  }
  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    setHover(true)
    e.preventDefault()
  }
  const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    setHover(false)
    e.preventDefault()
  }
  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    setHover(false)
    Analytics.send('CustomBMS', 'drop')
    e.preventDefault()
    onFileDrop(e.nativeEvent).then((song) => {
      if (song && onSongLoaded) onSongLoaded(song)
    })
  }
  const handleFileSelect = (file: File) => {
    Analytics.send('CustomBMS', 'select')
    onFileSelect(file)
  }

  return (
    <Panel className='CustomBMS' title='Load Custom BMS'>
      <div className='CustomBMSのwrapper'>
        <div className='CustomBMSのinstruction'>
          Please drag and drop a BMS folder into the drop zone below.
        </div>
        <div className='CustomBMSのremark'>
          This feature is only supported in Google Chrome and Firefox.
        </div>
        <div className='CustomBMSのremark'>
          Please don’t play unauthorized / illegally obtained BMS files.
        </div>
        <div className='CustomBMSのremark'>
          Experimental: You can paste IPFS path/URL here.
        </div>
        <div
          className={c('CustomBMSのdropzone', {
            'is-hover': hover,
          })}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {log ? (
            log.length ? (
              <div className='CustomBMSのlog'>
                {log.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            ) : (
              <div className='CustomBMSのlog'>
                <p>Omachi kudasai...</p>
              </div>
            )
          ) : (
            <div className='CustomBMSのdropzoneHint'>
              Drop BMS folder here.
              <input
                type='file'
                id='CustomBMSのdropzoneInput'
                className='CustomBMSのdropzoneInput'
                accept='.zip,.7z,.rar'
                ref={dropzoneInput}
                onChange={() => {
                  handleFileSelect(dropzoneInput.current!.files![0])
                }}
              />
              <label
                htmlFor='CustomBMSのdropzoneInput'
                className='CustomBMSのdropzoneInputLabel'
              >
                Select File on Device.
              </label>
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}

export default CustomBMS
