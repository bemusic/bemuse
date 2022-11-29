import './Scene.scss'

import React, { DragEvent, ForwardedRef, forwardRef } from 'react'

import c from 'classnames'

export interface SceneProps {
  className: string
  children: ReactNode
  onDragEnter?: (e: DragEvent<HTMLDivElement>) => void
}

const Scene = (
  { className, children, onDragEnter }: SceneProps,
  ref: ForwardedRef<HTMLDivElement>
) => (
  <div ref={ref} className={c('Scene', className)} onDragEnter={onDragEnter}>
    {children}
  </div>
)

export default forwardRef(Scene)
