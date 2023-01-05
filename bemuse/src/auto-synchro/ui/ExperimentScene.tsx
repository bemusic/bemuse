import './ExperimentScene.scss'

import React, { MouseEventHandler } from 'react'

import { Observable } from 'rxjs'
import c from 'classnames'
import { useObservable } from 'react-rx'

export type ExperimentState =
  | {
      type: 'loading'
    }
  | { type: 'ready' }
  | {
      type: 'started'
    }
  | {
      type: 'listening'
      numSamples: number
    }
  | {
      type: 'finished'
      numSamples: number
      latency: number
    }

const initialState = {
  type: 'loading',
} as const

export interface ExperimentSceneProps {
  stateStream: Observable<ExperimentState>
  onStart?: MouseEventHandler<HTMLButtonElement>
}

const ExperimentScene = (props: ExperimentSceneProps) => {
  const state = useObservable(props.stateStream, initialState)
  return (
    <div
      className={c('ExperimentScene', {
        'is-finished': state.type === 'finished',
      })}
    >
      <div className='ExperimentSceneのwrapper'>
        <div className='ExperimentSceneのwrapperInner'>
          <Contents state={state} onStart={props.onStart} />
        </div>
      </div>
    </div>
  )
}

export default ExperimentScene

const Ready = ({
  onStart,
}: {
  onStart?: MouseEventHandler<HTMLButtonElement>
}) => (
  <div className='ExperimentSceneのready'>
    <button className='ExperimentSceneのbutton' onClick={onStart}>
      Start Calibration
    </button>
  </div>
)

const Message = ({ text }: { text: string }) => (
  <div className='ExperimentSceneのmessage'>{text}</div>
)

const Contents = ({
  state,
  onStart,
}: Pick<ExperimentSceneProps, 'onStart'> & { state: ExperimentState }) => {
  if (state.type === 'loading') {
    return null
  }
  if (state.type === 'ready') {
    return <Ready onStart={onStart} />
  }
  if (state.type === 'started') {
    return <Message text='Please listen to the beats…' />
  }

  const finished = state.type === 'finished'
  const scale = finished ? 1 : easeOut(Math.min(1, state.numSamples / 84))
  const transform = `scaleX(${scale})`
  const style = {
    transform: transform,
    WebkitTransform: transform,
  }
  return (
    <div className='ExperimentSceneのcollection'>
      <Message
        text={
          finished
            ? `Your latency is ${state.latency}ms. Please close this window.`
            : 'Please press the space bar when you hear the kick drum.'
        }
      />
      <div className='ExperimentSceneのprogress'>
        <div className='ExperimentSceneのprogressBar' style={style} />
      </div>
    </div>
  )
}

function easeOut(x: number) {
  return 1 - Math.pow(1 - x, 2)
}
