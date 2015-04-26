
import './options-input-key.scss'
import React from 'react'
import c     from 'classnames'

export default React.createClass({
  render() {
    return <div className="options-input-key" data-n={this.props.n}>
      <div
          className={c('options-input-key--contents',
              { 'is-editing': this.props.isEditing })}
          onClick={this.handleClick}>
        <div className="options-input-key--text">{this.props.text}</div>
      </div>
    </div>
  },
  handleClick() {
    this.props.onEdit('' + this.props.n)
  },
})
