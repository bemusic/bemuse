import './ExperimentScene.scss'

import React, { MouseEventHandler } from 'react'

import { Observable } from 'rxjs'
import c from 'classnames'
import { useObservable } from 'bemuse/flux'

const Collection = ({
  finished,
  numSamples,
  latency,
}: {
  finished: boolean
  numSamples: number
  latency: number
}) => {
  const scale = finished ? 1 : easeOut(Math.min(1, numSamples / 84))
  const transform = 'scaleX(' + scale + ')'
  const style = {
    transform: transform,
    WebkitTransform: transform,
  }
  return (
    <div className='ExperimentSceneのcollection'>
      <Message
        text={
          finished
            ? 'Your latency is ' + latency + 'ms. Please close this window.'
            : 'Please press the space bar when you hear the kick drum.'
        }
      />
      <div className='ExperimentSceneのprogress'>
        <div className='ExperimentSceneのprogressBar' style={style} />
      </div>
    </div>
  )
}

const Message = ({ text }: { text: string }) => (
  <div className='ExperimentSceneのmessage'>{text}</div>
)

const Ready = ({
  onStart,
}: {
  onStart?: MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <div className='ExperimentSceneのready'>
      <button className='ExperimentSceneのbutton' onClick={onStart}>
        Start Calibration
      </button>
    </div>
  )
}

interface ExperimentSceneContentsProps {
  finished: boolean
  loading: boolean
  started: boolean
  listening: boolean
  numSamples: number
  latency: number
  onStart?: MouseEventHandler<HTMLButtonElement>
}

const Contents = ({
  loading,
  started,
  listening,
  onStart,
  finished,
  numSamples,
  latency,
}: ExperimentSceneContentsProps) => {
  if (loading) {
    return null
  } else if (!started) {
    return <Ready onStart={onStart} />
  } else if (!listening) {
    return <Message text='Please listen to the beats…' />
  } else {
    return (
      <Collection
        finished={finished}
        numSamples={numSamples}
        latency={latency}
      />
    )
  }
}

export interface ExperimentSceneProps {
  stateStream: Observable<{
    finished: boolean
    loading: boolean
    started: boolean
    listening: boolean
    numSamples: number
    latency: number
  }>
  onStart?: MouseEventHandler<HTMLButtonElement>
}

const ExperimentScene = (props: ExperimentSceneProps) => {
  const state = useObservable(props.stateStream)
  if (!state) {
    return <></>
  }

  return (
    <div className={c('ExperimentScene', { 'is-finished': state.finished })}>
      <div className='ExperimentSceneのwrapper'>
        <div className='ExperimentSceneのwrapperInner'>
          <Contents {...state} onStart={props.onStart} />
        </div>
      </div>
    </div>
  )
}

export default ExperimentScene

function easeOut(x: number) {
  return 1 - Math.pow(1 - x, 2)
}
