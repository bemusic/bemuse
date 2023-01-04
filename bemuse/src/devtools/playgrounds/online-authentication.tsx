import AuthenticationPopup from 'bemuse/online/ui/AuthenticationPopup'
import React from 'react'
import { sceneRoot } from 'bemuse/utils/main-element'

const OnlineAuthenticationTestScene = () => (
  <div>
    <AuthenticationPopup />
  </div>
)

export function main() {
  sceneRoot.render(<OnlineAuthenticationTestScene />)
}
