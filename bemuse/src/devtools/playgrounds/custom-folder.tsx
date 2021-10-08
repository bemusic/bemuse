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
    } finally {
      queryClient.invalidateQueries('customFolder')
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
          <p>✅ A folder has been selected.</p>
          <hr />
          <p>
            Click the Scan button to scan for new songs 👉{' '}
            <button onClick={scan}>🕵️ Scan</button>
          </p>
          <p>
            Scan status: {status}
            <br />
            Number of songs in the database: {(data.songs || []).length || 0}
          </p>
          <p>
            Once the songs are in the database, you can
            <a href='.' style={{ color: '#abc' }}>
              play them in Bemuse!
            </a>
          </p>
          <hr />
          <p>
            Click the Clear button to remove the folder selection 👉{' '}
            <button onClick={clear}>❌ Clear</button>
          </p>
        </div>
      ) : (
        <div>
          <p>No folder selected.</p>
          <button onClick={setFolder}>Set folder</button>
          <p>
            To get started, click the button above to select a song folder. (It
            can contain many songs, each song in its own folder.)
          </p>
        </div>
      )}
    </div>
  )
}

export function main() {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <div style={{ margin: '0 auto', maxWidth: '32em', padding: '0 1em' }}>
        <h1>Bemuse custom song folder console</h1>
        <p>
          This is a console for testing an upcoming feature: ✨
          <strong>custom song folders</strong>✨. You can set a folder to scan
          for custom songs, and it will be available in Bemuse game, no need to
          drag individual songs anymore! A more polished UI may be added in
          later, I hope.
        </p>
        <CustomFolderTester />
      </div>
    </QueryClientProvider>,
    MAIN
  )
}
