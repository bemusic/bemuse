
import React from 'react'
import MAIN  from 'bemuse/utils/main-element'
import AuthenticationPopup from 'bemuse/online/ui/AuthenticationPopup'

const OnlineAuthenticationTestScene = React.createClass({
  render() {
    return <div>
      <AuthenticationPopup />
    </div>
  }
})

export function main() {
  React.render(<OnlineAuthenticationTestScene />, MAIN)
}
