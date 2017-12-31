import './Panel.scss'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'

export default class Panel extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node
  }

  render () {
    return (
      <div className={c('Panel', this.props.className)}>
        <div className='Panelのtitle'>{this.props.title}</div>
        <div className='Panelのcontent'>{this.props.children}</div>
      </div>
    )
  }
}
