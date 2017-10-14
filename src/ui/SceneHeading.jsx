
import './SceneHeading.scss'

import React  from 'react'
import c      from 'classnames'

export default class SceneHeading extends React.Component {
  render() {
    return <div className={c('SceneHeading', this.props.className)}>
      {this.props.children}
    </div>
  }
}
