
import './LoadingSceneProgressBar.scss'
import React from 'react'

export default class LoadingSceneProgressBar extends React.Component {
  render () {
    return <div className="LoadingSceneProgressBar">
      <div
        className="LoadingSceneProgressBarのbar"
        style={{ width: this.props.width }}></div>
    </div>
  }
}
