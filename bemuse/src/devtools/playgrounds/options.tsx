import ModalPopup from 'bemuse/ui/ModalPopup'
import Options from 'bemuse/app/ui/Options'
import React from 'react'
import { sceneRoot } from 'bemuse/utils/main-element'

const noop = () => {}

const OptionsPlayground = () => (
  <ModalPopup visible onBackdropClick={noop}>
    <Options onClose={noop} />
  </ModalPopup>
)

export function main() {
  sceneRoot.render(<OptionsPlayground />)
}
