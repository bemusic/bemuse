import { get, set } from 'idb-keyval'
import NotechartLoader from 'bemuse-notechart/lib/loader'
import { showAlert } from 'bemuse/ui-dialogs'
import { createNotechartPreview } from './NotechartPreview'

const PREVIEWER_FS_HANDLE_KEYVAL_KEY = 'previewer-fs-handle'

export async function loadPreview() {
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

  const chartHandle =
    chartHandles.find((c) => c.name === data.chartFileName) || chartHandles[0]
  if (!chartHandle) {
    throw new Error('No chart found.')
  }

  const notechartLoader = new NotechartLoader()
  const arrayBuffer = await (await chartHandle.handle.getFile()).arrayBuffer()
  const notechart = await notechartLoader.load(
    arrayBuffer,
    { name: chartHandle.name },
    { scratch: 'left', double: true }
  )
  const preview = createNotechartPreview(notechart, chartHandle.name)
  console.log(preview)
  return preview
}

async function ensureReadable(directoryHandle: FileSystemDirectoryHandle) {
  try {
    await directoryHandle.requestPermission({ mode: 'read' })
  } catch (error) {
    await showAlert(
      'File system access required',
      'Please allow access to the filesystem.'
    )
    await directoryHandle.requestPermission({ mode: 'read' })
  }
}

export async function setPreview(handle: FileSystemDirectoryHandle) {
  await set(PREVIEWER_FS_HANDLE_KEYVAL_KEY, {
    directory: handle,
  })
}
