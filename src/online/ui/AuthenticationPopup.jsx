
import './AuthenticationPopup.scss'
import React from 'react'
import ModalPopup from 'bemuse/ui/ModalPopup'
import AuthenticationPanel from './AuthenticationPanel'

export default class extends React.Component {
  render() {
    return <ModalPopup {...this.props}>
      <div className="AuthenticationPopup">
        <AuthenticationPanel onFinish={this.props.onFinish} />
      </div>
    </ModalPopup>
  }
}
