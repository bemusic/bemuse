import './GameShellScene.scss'

import DndResources from 'bemuse/resources/dnd-resources'
import c from 'classnames'
import React, { ChangeEvent, DragEvent, FormEvent, useState } from 'react'
import { IResource, IResources } from 'bemuse/resources/types'
import { PanelPlacement, ScratchPosition } from 'bemuse/app/entities/Options'

interface BmsEntry {
  name: string
  resource: IResource
}

interface CustomChartSelectorProps {
  files: readonly BmsEntry[]
  selectedResource?: IResource | null
  onSelect: (resource: IResource | null) => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
}

const CustomChartSelector = ({
  files,
  selectedResource,
  onSelect,
  onDrop,
}: CustomChartSelectorProps) => {
  const handleItemClick = (file: BmsEntry) => () => {
    onSelect(file.resource)
  }

  const handleClear = () => {
    onSelect(null)
  }

  return (
    <div className='drop-zone'>
      {files.length ? (
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              <a
                onClick={handleItemClick(file)}
                className={c({
                  'is-active': file.resource === selectedResource,
                })}
              >
                {file.name}
              </a>
            </li>
          ))}
          {selectedResource ? (
            <li>
              <a onClick={handleClear}>Clear</a>
            </li>
          ) : null}
        </ul>
      ) : (
        <div className='drop-zone-hint' onDrop={onDrop}>
          Drop BMS folder here
          <br />
          (only works on Google Chrome)
        </div>
      )}
    </div>
  )
}

export interface OptionsDraft {
  resource?: IResource | null
  resources?: IResources
  url: string
  game: {
    audioInputLatency: number
  }
  players: {
    speed: number
    autoplay: boolean
    placement: PanelPlacement
    scratch: ScratchPosition
    input: {
      keyboard: {
        1: number
        2: number
        3: number
        4: number
        5: number
        6: number
        7: number
        SC: number
        SC2: number
      }
    }
  }[]
  tutorial?: boolean
  soundVolume?: number
}

export interface GameShellSceneProps {
  options: OptionsDraft
  play: (options: OptionsDraft) => void
}

const GameShellScene = ({
  options: initOptions,
  play,
}: GameShellSceneProps) => {
  const [options, setOptions] = useState(initOptions)
  const [files, setFiles] = useState<BmsEntry[]>([])
  const [, setUpdate] = useState(false)
  const forceUpdate = () => setUpdate((flag) => !flag)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    play(options)
  }

  const bindOption = (
    binder: (options: OptionsDraft, newValue: string) => void
  ) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      binder(options, event.target.value)
      forceUpdate()
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const event = e.nativeEvent
    const resources = new DndResources(event)
    try {
      const list = await resources.fileList
      const names = list.filter((filename) =>
        /\.(bms|bme|bml)$/i.test(filename)
      )
      const bms = await Promise.all(
        names.map(async (name): Promise<BmsEntry> => {
          const resource = await resources.file(name)
          return { name, resource }
        })
      )
      setFiles(bms)
      setOptions((options) => ({ ...options, resources }))
    } catch (err) {
      if (err instanceof MediaError) {
        throw new Error('File Error code ' + err.code)
      } else {
        throw err
      }
    }
  }

  const handleSelectFile = (resource: IResource | null) => {
    setOptions((options) => ({ ...options, resource }))
    forceUpdate()
  }

  return (
    <div
      className='GameShellScene'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h1>Bemuse Game Shell</h1>
      <p>This tool is intended for developers testing the game.</p>
      <form onSubmit={submit}>
        <div className='text'>
          <label>
            <span className='label'>BMS URL:</span>
            <input
              type='text'
              disabled={!!options.resource}
              onChange={bindOption((o, v) => (o.url = v))}
              value={options.url}
            />
          </label>
        </div>
        <div className='text'>
          <label>
            <span className='label'>-or- Drop BMS folder here</span>
            <CustomChartSelector
              files={files}
              selectedResource={options.resource}
              onSelect={handleSelectFile}
              onDrop={handleDrop}
            />
          </label>
        </div>
        <div className='text'>
          <label>
            <span className='label'>Audio-Input Latency</span>
            <input
              type='text'
              onChange={bindOption(
                (o, v) => (o.game.audioInputLatency = parseInt(v, 10))
              )}
              value={options.game.audioInputLatency}
            />
          </label>
        </div>
        <div className='text'>
          <label>
            <span className='label'>HI-SPEED:</span>
            <input
              type='text'
              onChange={bindOption(
                (o, v) => (o.players[0].speed = parseInt(v, 10))
              )}
              value={options.players[0].speed}
            />
          </label>
        </div>
        <div className='radio'>
          <h3>Placement</h3>
          {(['left', 'center', 'right'] as const).map((placement) => (
            <label key={placement}>
              <input
                type='radio'
                value={placement}
                onChange={bindOption(
                  (o, v) => (o.players[0].placement = placement)
                )}
                checked={options.players[0].placement === placement}
              />
              <span className='label'>{placement}</span>
            </label>
          ))}
        </div>
        <button type='submit'>Play</button>
      </form>
    </div>
  )
}

export default GameShellScene
