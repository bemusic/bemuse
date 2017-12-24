import './SceneToolbar.scss'
import React from 'react'

export class SceneToolbar extends React.Component {
  render () {
    return <div className='SceneToolbar'>{this.props.children}</div>
  }
}

SceneToolbar.Spacer = class SceneToolbarSpacer extends React.Component {
  render () {
    return <div className='SceneToolbarのspacer' />
  }
}

export default SceneToolbar
