import './OptionsAdvanced.scss'

import * as Options from '../entities/Options'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import OptionsButton from './OptionsButton'
import OptionsInputField from './OptionsInputField'
import { selectOptions } from '../redux/ReduxState'

const stringifyLatency = (latency: number): string => {
  return Math.round(latency) + 'ms'
}

const parseLatency = (latencyText: string): number => {
  return parseInt(latencyText, 10)
}

const useLatency = (handler: (latency: number) => void) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://bemuse.ninja') {
        throw new Error('invalid origin')
      }
      if (event.data && typeof event.data.latency === 'number') {
        handler(event.data.latency)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])
}

const OptionsAdvanced = () => {
  const dispatch = useDispatch()
  const options = useSelector(selectOptions)

  const handleAudioInputLatencyChange = (value: number) => {
    dispatch(
      Options.optionsSlice.actions.CHANGE_AUDIO_INPUT_LATENCY({
        latency: value,
      })
    )
  }

  const handleCalibrateButtonClick = () => {
    const options = 'width=640,height=360'
    window.open('?mode=sync', 'sync', options)
  }

  useLatency(handleAudioInputLatencyChange)

  return (
    <div className='OptionsAdvanced'>
      <div className='OptionsAdvancedのgroup'>
        <label>Latency</label>
        <div className='OptionsAdvancedのgroupItem'>
          <OptionsInputField
            value={Options.audioInputLatency(options)}
            parse={parseLatency}
            stringify={stringifyLatency}
            validator={/^\d+(?:ms)?$/}
            onChange={handleAudioInputLatencyChange}
          />
          <label>audio</label>
        </div>
        <OptionsButton onClick={handleCalibrateButtonClick}>
          Calibrate
        </OptionsButton>
      </div>
    </div>
  )
}

export default OptionsAdvanced
