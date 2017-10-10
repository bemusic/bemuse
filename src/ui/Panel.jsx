
import './Panel.scss'
import React, { Component } from 'react'
import c from 'classnames'

export default class extends Component {
  render ({ className, children, title }) {
    return <div className={c('Panel', className)}>
      <div className="Panelのtitle">{title}</div>
      <div className="Panelのcontent">{children}</div>
    </div>
  }
}
