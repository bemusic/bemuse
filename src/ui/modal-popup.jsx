
import './modal-popup.scss'
import React from 'react'
import c     from 'classnames'

export default React.createClass({
  render() {
    return <div className={c('modal-popup',
        { 'is-visible': this.props.visible })}>
      <div className="modal-popup--backdrop"
          onClick={this.props.onBackdropClick}></div>
      <div className="modal-popup--contents">
        {this.props.children}
      </div>
    </div>
  }
})
