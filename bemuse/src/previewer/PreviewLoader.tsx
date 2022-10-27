import SamplingMaster, { Sample } from 'bemuse/sampling-master'
import { get, set } from 'idb-keyval'

import NotechartLoader from 'bemuse-notechart/lib/loader'
import ObjectID from 'bson-objectid'
import { PromisePool } from '@supercharge/promise-pool'
import _ from 'lodash'
import { createNotechartPreview } from './NotechartPreview'
import { showAlert } from 'bemuse/ui-dialogs'

const PREVIEWER_FS_HANDLE_KEYVAL_KEY = 'previewer-fs-handle'
const getSamplingMaster = _.once(() => {
  const samplingMaster = new SamplingMaster()
  // http://qiita.com/dtinth/items/1200681c517a3fb26357
  const DEFAULT_REPLAYGAIN = -12.2 // dB

  const volume = Math.pow(10, (DEFAULT_REPLAYGAIN + 4) / 20)
  const group = samplingMaster.group({ volume })
  return {
    samplingMaster,
    group,
  }
})

const keysoundCache = new Map<string, Sample>()
let keysoundCacheHandleId = ''

export async function getSavedPreviewInfo() {
  const data = await get(PREVIEWER_FS_HANDLE_KEYVAL_KEY)
  const chartFilename = data?.chartFilename
  return chartFilename ? { chartFilename } : null
}

type LoadPreviewOptions = {
  log: (message: string) => void
}

export async function loadPreview(loadOptions: LoadPreviewOptions) {
  const log =
    loadOptions.log ||
    ((message: string) => console.log(`[PreviewLoader] ${message}`))

  log('Loading directory handle from IndexedDB')
  const data = await get(PREVIEWER_FS_HANDLE_KEYVAL_KEY)
  const directoryHandle: FileSystemDirectoryHandle = data.directory
  const handleId = data.handleId

  log('Obtaining permission to read directory')
  await ensureReadable(directoryHandle)

  log('Scanning charts')
  const chartHandles: { name: string; handle: FileSystemFileHandle }[] = []
  for await (const [name, fileHandle] of directoryHandle) {
    if (fileHandle.kind === 'file' && /\.(bms|bme|bml|bmson)$/i.test(name)) {
      chartHandles.push({ name, handle: fileHandle })
    }
  }
  console.log(directoryHandle)

  const chartHandle =
    chartHandles.find((c) => c.name === data.chartFilename) || chartHandles[0]
  if (!chartHandle) {
    throw new Error('No chart found.')
  }

  log('Loading chart ' + chartHandle.name)
  const notechartLoader = new NotechartLoader()
  const arrayBuffer = await (await chartHandle.handle.getFile()).arrayBuffer()
  const notechart = await notechartLoader.load(
    arrayBuffer,
    { name: chartHandle.name },
    { scratch: 'left', double: true }
  )

  log('Loading samples')
  const { samplingMaster, group } = getSamplingMaster()
  let numLoadedSamples = 0
  if (keysoundCacheHandleId !== handleId) {
    keysoundCache.clear()
    keysoundCacheHandleId = handleId
  }
  const { results: samples } = await PromisePool.withConcurrency(64)
    .for(notechart.samples)
    .process(async (filename) => {
      if (keysoundCache.has(filename)) {
        const sample = keysoundCache.get(filename) || null
        return { filename, sample }
      }
      const load = async (name: string) => {
        const fileHandle = await directoryHandle.getFileHandle(name)
        const file = await fileHandle.getFile()
        return file.arrayBuffer()
      }
      try {
        const arrayBuffer = await load(
          filename.replace(/\.\w+$/, '.ogg')
        ).catch(() => load(filename))
        const sample = await samplingMaster.sample(arrayBuffer)
        const progress = `${++numLoadedSamples}/${notechart.samples.length}`
        log(`Loaded ${filename} [${progress}]: ${sample.duration}s`)
        keysoundCache.set(filename, sample)
        return { filename, sample }
      } catch (error) {
        console.error(error)
        log(`Failed to load ${filename}: ${error}`)
        return { filename, sample: null }
      }
    })
  console.log(samples)

  log('Loading preview')
  const preview = createNotechartPreview(
    notechart,
    chartHandle.name,
    samplingMaster,
    group,
    samples
  )
  console.log(preview)

  return preview
}

async function ensureReadable(directoryHandle: FileSystemDirectoryHandle) {
  let permission = await directoryHandle.queryPermission({ mode: 'read' })
  try {
    if (permission === 'prompt') {
      permission = await directoryHandle.requestPermission({ mode: 'read' })
    }
  } catch (error) {
    await showAlert(
      'File system access required',
      'Please allow access to the filesystem.'
    )
    permission = await directoryHandle.requestPermission({ mode: 'read' })
  }
  if (permission !== 'granted') {
    throw new Error('Permission denied.')
  }
}

export async function setPreview(
  handle: FileSystemDirectoryHandle,
  selectedChartFilename: string
) {
  await set(PREVIEWER_FS_HANDLE_KEYVAL_KEY, {
    directory: handle,
    chartFilename: selectedChartFilename,
    handleId: ObjectID.generate(),
  })
}
