
import './SceneToolbar.scss'
import React from 'react'

export const SceneToolbar = React.createClass({
  render() {
    return <div className="SceneToolbar">
      {this.props.children}
    </div>
  }
})

SceneToolbar.Spacer = React.createClass({
  render() {
    return <div className="SceneToolbarのspacer"></div>
  }
})

export default SceneToolbar
