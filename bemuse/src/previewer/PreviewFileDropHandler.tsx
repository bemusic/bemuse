import { useEffect } from 'react'

export const PreviewFileDropHandler: React.FC<{
  onDrop: (handle: FileSystemDirectoryHandle) => void
}> = (props) => {
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
      const handle = await item.getAsFileSystemHandle()!
      if (!handle || handle.kind !== 'directory') {
        alert('Please drop folder, not a file here.')
        return
      }
      await handle.requestPermission({ mode: 'read' })
      let numCharts = 0
      for await (let [name] of handle) {
        if (/\.(bms|bme|bml|bmson)$/i.test(name)) {
          numCharts++
        }
      }
      if (!numCharts) {
        alert('No BMS/bmson files found in folder.')
        return
      }
      props.onDrop(handle)
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
