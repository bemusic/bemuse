import './BemusePreviewer.scss'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { PreviewCanvas } from './PreviewCanvas'
import { PreviewInfo } from './PreviewInfo'
import { PreviewFileDropHandler } from './PreviewFileDropHandler'
import { get, set } from 'idb-keyval'
import WARP from 'bemuse/utils/warp-element'
import ModalPopup from 'bemuse/ui/ModalPopup'
import Panel from 'bemuse/ui/Panel'
import Button from 'bemuse/ui/Button'
import VBox from 'bemuse/ui/VBox'

const PREVIEWER_FS_HANDLE_KEYVAL_KEY = 'previewer-fs-handle'

async function loadPreview() {
  const data = await get(PREVIEWER_FS_HANDLE_KEYVAL_KEY)
  const directoryHandle: FileSystemDirectoryHandle = data.directory
  await ensureReadable(directoryHandle)

  const chartHandles: { name: string; handle: FileSystemFileHandle }[] = []
  for await (let [name, fileHandle] of directoryHandle) {
    if (fileHandle.kind === 'file' && /\.(bms|bme|bml|bmson)$/i.test(name)) {
      chartHandles.push({ name, handle: fileHandle })
    }
  }
  console.log(directoryHandle)
  console.log(chartHandles)
}

async function ensureReadable(directoryHandle: FileSystemDirectoryHandle) {
  try {
    await directoryHandle.requestPermission({ mode: 'read' })
  } catch (error) {
    await new Promise<void>((resolve) => {
      const container = document.createElement('div')
      WARP.appendChild(container)
      const onClick = () => {
        WARP.removeChild(container)
        ReactDOM.unmountComponentAtNode(container)
        resolve()
      }
      const popup = (
        <ModalPopup>
          <Panel title='File system access required'>
            <VBox padding={'1em'} gap={'0.75em'}>
              <div>Please allow access to the filesystem.</div>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={onClick}>OK</Button>
              </div>
            </VBox>
          </Panel>
        </ModalPopup>
      )
      ReactDOM.render(popup, container)
    })
    await directoryHandle.requestPermission({ mode: 'read' })
  }
}

export const BemusePreviewer = () => {
  useEffect(() => {
    loadPreview()
  }, [])

  const onDrop = async (handle: FileSystemDirectoryHandle) => {
    await set(PREVIEWER_FS_HANDLE_KEYVAL_KEY, {
      directory: handle,
    })
  }

  return (
    <div className='BemusePreviewer'>
      <div className='BemusePreviewerのheader'>
        <h1>
          <strong>Bemuse</strong> BMS/bmson previewer
        </h1>
      </div>
      <div className='BemusePreviewerのmain'>
        <PreviewCanvas />
        <PreviewInfo />
        <PreviewFileDropHandler onDrop={onDrop} />
      </div>
    </div>
  )
}
