import React from 'react'
import ReactDOM from 'react-dom'
import MAIN from 'bemuse/utils/main-element'
import AuthenticationPopup from 'bemuse/online/ui/AuthenticationPopup'

const OnlineAuthenticationTestScene = () => (
  <div>
    <AuthenticationPopup />
  </div>
)

export function main () {
  ReactDOM.render(<OnlineAuthenticationTestScene />, MAIN)
}
