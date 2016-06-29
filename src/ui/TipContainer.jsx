import React from 'react'
import './TipContainer.scss'

const TipContainer = ({ children, tip, tipVisible = true }) => (
  <div className="TipContainer">
    <div className="TipContainerのchildren">
      {children}
    </div>
    {tipVisible
      ? <span className="TipContainerのbubble">
        <span className="TipContainerのbubbleContent">{tip}</span>
      </span>
      : null
    }
  </div>
)

TipContainer.propTypes = {
  children: React.PropTypes.node,
  tip: React.PropTypes.node,
  tipVisible: React.PropTypes.bool
}

export default TipContainer
