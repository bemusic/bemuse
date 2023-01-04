import GenericErrorScene from 'bemuse/app/ui/GenericErrorScene'
import React from 'react'
import { sceneRoot } from 'bemuse/utils/main-element'

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
  sceneRoot.render(<ErrorScene />)
}
