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
        log: console.log,
        setStatus: _.throttle((text) => setStatus(text), 100),
        updateState: (newState) => {
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

  const songCount = ((data && data.songs) || []).length || 0
  const highlightIf = (condition: boolean) =>
    condition ? { color: '#ff8' } : {}
  return (
    <div>
      {data ? (
        <div>
          <p>✅ A folder has been selected</p>
          <hr />
          <p style={highlightIf(songCount === 0)}>
            Click the Scan button to scan for new songs 👉{' '}
            <button onClick={scan}>🕵️ Scan</button>
          </p>
          <p>
            <strong>Scan status:</strong>
            <br />
            <textarea
              value={status}
              readOnly
              style={{
                boxSizing: 'border-box',
                border: 'none',
                width: '100%',
                background: '#333',
                color: '#8e8',
                font: 'inherit',
              }}
              rows={3}
            />
          </p>
          <p>
            <strong>Number of songs in the database:</strong> {songCount}
          </p>
          <p style={highlightIf(songCount > 0)}>
            Once the songs are in the database, you can{' '}
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
          <p style={highlightIf(true)}>
            To get started 👉{' '}
            <button onClick={setFolder}>Set custom songs folder</button>
          </p>
          <p>
            The custom songs folder can contain any number of songs, but each
            song must be in a separate folder.
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
        <h1>Bemuse custom songs folder console</h1>
        <p>
          This is a console for testing an upcoming feature: ✨
          <a
            style={{ color: '#abc' }}
            href='https://github.com/bemusic/bemuse/discussions/696'
            target='_blank'
            rel='noreferrer'
          >
            <strong>custom songs folder</strong>
          </a>
          ✨. You can set a folder to scan for custom songs, and it will be
          available in Bemuse game, no need to drag individual songs anymore! A
          more polished UI may be added in later, I hope.
        </p>
        <p>
          <a
            style={{ color: '#abc' }}
            href='https://github.com/bemusic/bemuse/discussions/696'
            target='_blank'
            rel='noreferrer'
          >
            Check out the announcement post for troubleshooting and known
            issues.
          </a>
        </p>
        <hr />
        <CustomFolderTester />
      </div>
    </QueryClientProvider>,
    MAIN
  )
}
