
import React from 'react'
import ReactDOM from 'react-dom'
import MAIN from 'bemuse/utils/main-element'
import ModalPopup from 'bemuse/ui/ModalPopup'
import Options from 'bemuse/app/ui/Options'

const noop = () => { }

const OptionsPlayground = () => (
  <ModalPopup visible onBackdropClick={noop}>
    <Options onClose={noop} />
  </ModalPopup>
)

export function main () {
  ReactDOM.render(<OptionsPlayground />, MAIN)
}
