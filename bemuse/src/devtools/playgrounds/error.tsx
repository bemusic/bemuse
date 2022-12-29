import React from 'react'
import MAIN from 'bemuse/utils/main-element'
import GenericErrorScene from 'bemuse/app/ui/GenericErrorScene'
import ReactDOM from 'react-dom'

const ErrorScene = () => (
  <div>
    <GenericErrorScene
      error={new Error('yabai')}
      preamble='Test error.'
      onContinue={() => {}}
    />
  </div>
)

export function main() {
  ReactDOM.render(<ErrorScene />, MAIN)
}
