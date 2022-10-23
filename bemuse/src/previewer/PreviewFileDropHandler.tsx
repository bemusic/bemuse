import { showQuickPick } from 'bemuse/ui-dialogs'
import { useEffect } from 'react'

export interface PreviewFileDropHandler {
  onDrop: (
    handle: FileSystemDirectoryHandle,
    selectedChartFilename: string
  ) => void
}

export const PreviewFileDropHandler: FC<PreviewFileDropHandler> = (props) => {
  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
    }
    const onDrop = async (e: DragEvent) => {
      e.preventDefault()
      const items = e.dataTransfer!.items
      if (items.length !== 1) {
        alert('Please drop only one folder.')
        return
      }
      const item = items[0]
      if (item.kind !== 'file') {
        alert('Please drop only a folder here.')
        return
      }
      if (!('getAsFileSystemHandle' in item)) {
        alert('Unsupported browser (sorry).')
        return
      }
      const handleNullable = await item.getAsFileSystemHandle()
      if (!handleNullable || handleNullable.kind !== 'directory') {
        alert('Please drop folder, not a file here.')
        return
      }
      const handle = handleNullable as FileSystemDirectoryHandle
      await handle.requestPermission({ mode: 'read' })
      const chartFiles: { filename: string; label: string }[] = []
      for await (const [name] of handle.entries()) {
        if (/\.(bms|bme|bml|bmson)$/i.test(name)) {
          chartFiles.push({ filename: name, label: name })
        }
      }
      if (chartFiles.length === 0) {
        alert('No BMS/bmson files found in folder.')
        return
      }

      const selectedChartFile = await showQuickPick(chartFiles, {
        title: 'Select a chart file',
      })
      props.onDrop(handle, selectedChartFile.filename)
    }
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
    }
  }, [props.onDrop])
  return null
}
