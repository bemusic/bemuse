import './SceneHeading.scss'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'

export default class SceneHeading extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  }

  render () {
    return (
      <div className={c('SceneHeading', this.props.className)}>
        {this.props.children}
      </div>
    )
  }
}
