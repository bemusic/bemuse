import './LoadingSceneProgress.scss'

import React, { useEffect, useState } from 'react'

import LoadingSceneProgressBar from './LoadingSceneProgressBar'
import { Observable } from 'bemuse/utils/observable'

const Item = ({ text, progressText, progress }: TaskItem) => {
  const width = Math.round(progress * 100 || 0).toString() + '%'
  const extra = progressText ? ` (${progressText})` : ''
  return (
    <div key={text} className='LoadingSceneProgressのitem'>
      <LoadingSceneProgressBar width={width} />
      {text}
      <span className='LoadingSceneProgressのextra'>{extra}</span>
    </div>
  )
}

export interface TaskItem {
  text: string
  progressText: string
  progress: number
}

export type Tasks = Observable<TaskItem[]>

export interface LoadingSceneProgressProps {
  tasks: Tasks
}

const LoadingSceneProgress = ({ tasks }: LoadingSceneProgressProps) => {
  const [, updater] = useState(false)
  const forceUpdate = () => updater((flag) => !flag)

  useEffect(() => {
    const unsubscribe = tasks.watch(forceUpdate)
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className='LoadingSceneProgress'>
      {tasks.value?.map((task) => (
        <Item key={task.text} {...task} />
      ))}
    </div>
  )
}

export default LoadingSceneProgress
