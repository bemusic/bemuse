import React from 'react'
import _ from 'lodash'
import MAIN from 'bemuse/utils/main-element'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {
  getCustomFolderState,
  getDefaultCustomFolderContext,
  scanFolder,
  setCustomFolder,
} from 'bemuse/custom-folder'

const queryClient = new QueryClient()

const CustomFolderTester = () => {
  const context = getDefaultCustomFolderContext()
  const { isLoading, error, data } = useQuery('customFolder', async () => {
    const result = await getCustomFolderState(context)
    return result
  })
  const [status, setStatus] = React.useState('')

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>An error has occurred: {`${error}`}</div>

  const setFolder = async () => {
    try {
      const handle = await window.showDirectoryPicker({ id: 'custom-folder' })
      await setCustomFolder(context, handle)
    } catch (e) {
      console.error(e)
      alert(`An error has occurred: ${e}`)
    }
  }

  const scan = async () => {
    try {
      await scanFolder(context, {
        log: text => console.log(text),
        setStatus: _.throttle(text => setStatus(text), 100),
      })
    } catch (e) {
      console.error(e)
      alert(`An error has occurred: ${e}`)
    }
  }

  return (
    <div>
      <h1>Custom folder</h1>
      {data ? (
        <div>
          <p>{(data.songs || []).length || 0} songs</p>
          <p>Scan status — {status}</p>
          <p>
            <button onClick={scan}>Scan</button> &larr; open devtools to see
            logs
          </p>
        </div>
      ) : (
        <div>
          <button onClick={setFolder}>Set folder</button>
        </div>
      )}
    </div>
  )
}

export function main() {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <CustomFolderTester />
    </QueryClientProvider>,
    MAIN
  )
}
