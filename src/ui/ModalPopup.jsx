
import './ModalPopup.scss'
import React        from 'react'
import c            from 'classnames'

// TODO: Reimplement using the Portals API
// https://reactjs.org/docs/portals.html
export default class ModalPopup extends React.Component {
  render () {
    if (this.props.visible === false) return null
    return <div className={c('ModalPopup',
      { 'is-visible': this.props.visible !== false })}>
      <div className="ModalPopupのbackdrop"
        onClick={this.props.onBackdropClick}></div>
      <div className="ModalPopupのcontents">
        {this.props.children}
      </div>
    </div>
  }
}
