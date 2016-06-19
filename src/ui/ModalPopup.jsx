
import './ModalPopup.scss'
import React        from 'react'
import c            from 'classnames'
import { WarpPortal } from '../react-warp'

export default React.createClass({
  render () {
    if (this.props.visible === false) return null
    return <WarpPortal content={
      <div className={c('ModalPopup',
        { 'is-visible': this.props.visible !== false })}>
        <div className="ModalPopupのbackdrop"
          onClick={this.props.onBackdropClick}></div>
        <div className="ModalPopupのcontents">
          {this.props.children}
        </div>
      </div>
    }>
      <span style={{ display: 'none' }}></span>
    </WarpPortal>
  }
})
