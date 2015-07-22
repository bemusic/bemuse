
import './authentication-popup.scss'
import React from 'react'
import ModalPopup from 'bemuse/ui/modal-popup'
import AuthenticationPanel from './authentication-panel'

export default React.createClass({
  render() {
    return <ModalPopup>
      <div className="authentication-popup">
        <AuthenticationPanel />
      </div>
    </ModalPopup>
  }
})
