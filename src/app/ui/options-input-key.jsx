
import './options-input-key.scss'
import React from 'react'
import c     from 'classnames'

export default React.createClass({
  render() {
    return <div className="options-input-key" data-n={this.props.n}>
      <div className="options-input-key--contents">
      </div>
    </div>
  }
})
