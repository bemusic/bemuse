import './SceneHeading.scss'

import React from 'react'
import c from 'classnames'

export interface SceneHeadingProps {
  className?: string
  children?: ReactNode
}

const SceneHeading = ({ className, children }: SceneHeadingProps) => (
  <div className={c('SceneHeading', className)}>{children}</div>
)

export default SceneHeading
