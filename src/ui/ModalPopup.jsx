
import './ModalPopup.scss'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import WarpContainer from './WarpContainer'

export default class ModalPopup extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onBackdropClick: PropTypes.func,
    children: PropTypes.node
  }

  render () {
    if (this.props.visible === false) return null
    return <WarpContainer>
      <div className={c('ModalPopup',
        { 'is-visible': this.props.visible !== false })}>
        <div className='ModalPopupのbackdrop'
          onClick={this.props.onBackdropClick} />
        <div className='ModalPopupのcontents'>
          {this.props.children}
        </div>
      </div>
    </WarpContainer>
  }
}
