
import './panel.scss'
import React from 'react'
import c from 'classnames'

export default React.createClass({
  render() {
    return <div className={c('panel', this.props.className)}>
      <div className="panel--title">{this.props.title}</div>
      <div className="panel--content">{this.props.children}</div>
    </div>
  }
})
