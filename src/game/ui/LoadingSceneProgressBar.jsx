
import './LoadingSceneProgressBar.scss'
import React from 'react'

export default React.createClass({
  render () {
    return <div className="LoadingSceneProgressBar">
      <div
        className="LoadingSceneProgressBarのbar"
        style={{ width: this.props.width }}></div>
    </div>
  }
})
