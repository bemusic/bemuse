import './Scene.scss'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'

export class Scene extends Component {
  render ({ className, children, onDragEnter }) {
    return <div
      className={c('Scene', className)}
      onDragEnter={onDragEnter}
    >
      {children}
    </div>
  }
}

Scene.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onDragEnter: PropTypes.func
}
