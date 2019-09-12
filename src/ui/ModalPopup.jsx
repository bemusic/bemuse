import './ModalPopup.scss'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import WarpContainer from './WarpContainer'

export default class ModalPopup extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onBackdropClick: PropTypes.func,
    children: PropTypes.node,
  }

  render() {
    if (this.props.visible === false) return null
    return (
      <WarpContainer>
        <div
          className={c('ModalPopup', {
            'is-visible': this.props.visible !== false,
          })}
          onClick={this.props.onBackdropClick}
        >
          <div className='ModalPopupのscroller'>
            <div className='ModalPopupのcontentsContainer'>
              <div
                className='ModalPopupのcontents'
                onClick={e => e.stopPropagation()}
              >
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </WarpContainer>
    )
  }
}
