import React from 'react'
import _ from 'lodash'
import MAIN from 'bemuse/utils/main-element'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {
  clearCustomFolder,
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
        updateState: newState => {
          queryClient.setQueryData('customFolder', newState)
        },
      })
    } catch (e) {
      console.error(e)
      alert(`An error has occurred: ${e}`)
    } finally {
      queryClient.invalidateQueries('customFolder')
    }
  }

  const clear = async () => {
    try {
      await clearCustomFolder(context)
    } catch (e) {
      console.error(e)
      alert(`An error has occurred: ${e}`)
    } finally {
      queryClient.invalidateQueries('customFolder')
    }
  }

  return (
    <div>
      {data ? (
        <div>
          <p>{(data.songs || []).length || 0} songs</p>
          <p>Scan status — {status}</p>
          <p>
            <button onClick={scan}>Scan</button> &larr; open devtools to see
            logs
          </p>
          <p>
            <button onClick={clear}>Clear</button>
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
      <div style={{ margin: '0 auto', maxWidth: '720px', padding: '0 1em' }}>
        <CustomFolderTester />
      </div>
    </QueryClientProvider>,
    MAIN
  )
}
