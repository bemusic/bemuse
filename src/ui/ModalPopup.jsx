
import './ModalPopup.scss'
import React, { Component } from 'react'
import c from 'classnames'
import { WarpPortal } from '../react-warp'

export default class extends Component {
  render ({ children, onBackdropClick, visible }) {
    if (visible === false) return null
    return <WarpPortal content={
      <div className={c('ModalPopup',
        { 'is-visible': visible !== false })}>
        <div className="ModalPopupのbackdrop"
          onClick={onBackdropClick}></div>
        <div className="ModalPopupのcontents">
          {children}
        </div>
      </div>
    }>
      <span style={{ display: 'none' }}></span>
    </WarpPortal>
  }
}
