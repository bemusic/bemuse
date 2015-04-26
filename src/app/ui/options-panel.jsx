
import './options-panel.scss'
import React from 'react'

export default React.createClass({
  render() {
    return <div className="options-panel">
      <div className="options-panel--title">{this.props.title}</div>
      <div className="options-panel--content">{this.props.children}</div>
    </div>
  }
})
