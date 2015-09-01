
import './modal-popup.scss'
import React        from 'react'
import c            from 'classnames'
import { Overlay }  from 'react-overlay-popup'

export default React.createClass({
  render() {
    if (this.props.visible === false) return null
    return <Overlay>
      <div className={c('ModalPopup',
        { 'is-visible': this.props.visible !== false })}>
        <div className="ModalPopupのbackdrop"
            onClick={this.props.onBackdropClick}></div>
        <div className="ModalPopupのcontents">
          {this.props.children}
        </div>
      </div>
    </Overlay>
  }
})
