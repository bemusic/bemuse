import './Scene.scss'

import c from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'

export default class Scene extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onDragEnter: PropTypes.func
  }

  render () {
    return <div
      className={c('Scene', this.props.className)}
      onDragEnter={this.props.onDragEnter}
    >
      {this.props.children}
    </div>
  }
}
