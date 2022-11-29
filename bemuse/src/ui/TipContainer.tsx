import './TipContainer.scss'

import React from 'react'

const TipContainer = ({
  children,
  tip,
  tipVisible = true,
}: {
  children?: ReactNode
  tip?: ReactNode
  tipVisible?: boolean
}) => (
  <div className='TipContainer'>
    <div className='TipContainerのchildren'>{children}</div>
    {tipVisible ? (
      <span className='TipContainerのbubble'>
        <span className='TipContainerのbubbleContent'>{tip}</span>
      </span>
    ) : null}
  </div>
)

export default TipContainer
