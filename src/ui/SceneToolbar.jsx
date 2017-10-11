
import './SceneToolbar.scss'
import React, { Component } from 'react'

export class SceneToolbar extends Component {
  render ({ children }) {
    return <div className="SceneToolbar">
      {children}
    </div>
  }
}

SceneToolbar.Spacer = class extends Component {
  render () {
    return <div className="SceneToolbarのspacer"></div>
  }
}

export default SceneToolbar
