import './ExperimentScene.scss'

import c from 'classnames'
import React, { MouseEventHandler } from 'react'

export interface ExperimentSceneProps {
  finished: boolean
  loading: boolean
  started: boolean
  listening: boolean
  numSamples: number
  latency: number
  onStart?: MouseEventHandler<HTMLButtonElement>
}

const ExperimentScene = (props: ExperimentSceneProps) => {
  return (
    <div className={c('ExperimentScene', { 'is-finished': props.finished })}>
      <div className='ExperimentSceneのwrapper'>
        <div className='ExperimentSceneのwrapperInner'>
          <Contents {...props} onStart={props.onStart} />
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
  loading,
  started,
  listening,
  onStart,
  finished,
  numSamples,
  latency,
}: ExperimentSceneProps) => {
  if (loading) {
    return null
  }
  if (!started) {
    return <Ready onStart={onStart} />
  }
  if (!listening) {
    return <Message text='Please listen to the beats…' />
  }
  return (
    <Collection finished={finished} numSamples={numSamples} latency={latency} />
  )
}

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
            ? `Your latency is ${latency}ms. Please close this window.`
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
