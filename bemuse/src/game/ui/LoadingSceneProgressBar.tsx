import './LoadingSceneProgressBar.scss'

import React from 'react'

export interface LoadingSceneProgressBarProps {
  width: string | number
}

const LoadingSceneProgressBar = ({ width }: LoadingSceneProgressBarProps) => (
  <div className='LoadingSceneProgressBar'>
    <div className='LoadingSceneProgressBarのbar' style={{ width }} />
  </div>
)

export default LoadingSceneProgressBar
