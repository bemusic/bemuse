
import './SceneHeading.scss'

import React, { Component } from 'react'
import c from 'classnames'

export default class extends Component {
  render ({ className, children }) {
    return <div className={c('SceneHeading', className)}>
      {children}
    </div>
  }
}
