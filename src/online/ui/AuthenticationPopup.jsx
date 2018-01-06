import './AuthenticationPopup.scss'
import React from 'react'
import PropTypes from 'prop-types'
import ModalPopup from 'bemuse/ui/ModalPopup'
import AuthenticationPanel from './AuthenticationPanel'

export default class AuthenticationPopup extends React.Component {
  static propTypes = {
    onFinish: PropTypes.func
  }

  render () {
    return (
      <ModalPopup {...this.props}>
        <div className='AuthenticationPopup'>
          <AuthenticationPanel onFinish={this.props.onFinish} />
        </div>
      </ModalPopup>
    )
  }
}
