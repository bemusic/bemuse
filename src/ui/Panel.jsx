
import './Panel.scss'
import React from 'react'
import c from 'classnames'

export default class Panel extends React.Component {
  render () {
    return <div className={c('Panel', this.props.className)}>
      <div className='Panelのtitle'>{this.props.title}</div>
      <div className='Panelのcontent'>{this.props.children}</div>
    </div>
  }
}
