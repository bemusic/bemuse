
import React      from 'react'
import MAIN       from 'bemuse/utils/main-element'
import ModalPopup from 'bemuse/ui/modal-popup'
import Options    from 'bemuse/app/ui/options'

const OptionsPlayground = React.createClass({
  render() {
    return <ModalPopup visible onBackdropClick={() => {}}>
      <Options onClose={() => {}} />
    </ModalPopup>
  }
})

export function main() {
  React.render(<OptionsPlayground />, MAIN)
}
