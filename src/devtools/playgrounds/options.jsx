
import React      from 'react'
import MAIN       from 'bemuse/utils/main-element'
import ModalPopup from 'bemuse/ui/ModalPopup'
import Options    from 'bemuse/app/ui/Options'

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
