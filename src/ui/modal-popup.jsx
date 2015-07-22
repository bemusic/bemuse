
import './modal-popup.scss'
import React        from 'react'
import c            from 'classnames'
import { Overlay }  from 'react-overlay-popup'

export default React.createClass({
  render() {
    if (this.props.visible === false) return null
    return <Overlay>
      <div className={c('modal-popup',
        { 'is-visible': this.props.visible !== false })}>
        <div className="modal-popup--backdrop"
            onClick={this.props.onBackdropClick}></div>
        <div className="modal-popup--contents">
          {this.props.children}
        </div>
      </div>
    </Overlay>
  }
})
