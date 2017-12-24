import React from 'react'
import PropTypes from 'prop-types'
import './TipContainer.scss'

const TipContainer = ({ children, tip, tipVisible = true }) => (
  <div className='TipContainer'>
    <div className='TipContainerのchildren'>
      {children}
    </div>
    {tipVisible
      ? <span className='TipContainerのbubble'>
        <span className='TipContainerのbubbleContent'>{tip}</span>
      </span>
      : null
    }
  </div>
)

TipContainer.propTypes = {
  children: PropTypes.node,
  tip: PropTypes.node,
  tipVisible: PropTypes.bool
}

export default TipContainer
