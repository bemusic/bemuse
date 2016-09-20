import './Scene.scss'

import c from 'classnames'
import React from 'react'

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    onDragEnter: React.PropTypes.func
  },
  render () {
    return <div
      className={c('Scene', this.props.className)}
      onDragEnter={this.props.onDragEnter}
    >
      {this.props.children}
    </div>
  }
})
