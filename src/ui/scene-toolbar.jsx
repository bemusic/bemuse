
import './scene-toolbar.scss'
import React from 'react'

export const SceneToolbar = React.createClass({
  render() {
    return <div className="scene-toolbar">
      {this.props.children}
    </div>
  }
})

SceneToolbar.Spacer = React.createClass({
  render() {
    return <div className="scene-toolbar--spacer"></div>
  }
})

export default SceneToolbar
