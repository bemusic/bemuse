
import './loading-scene-progress-bar.scss'
import React from 'react'

export default React.createClass({
  render() {
    return <div className="loading-scene-progress-bar">
      <div
          className="loading-scene-progress-bar--bar"
          style={{ width: this.props.width }}></div>
    </div>
  }
})
