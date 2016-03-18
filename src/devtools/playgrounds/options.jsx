
import React      from 'react'
import MAIN       from 'bemuse/utils/main-element'
import ModalPopup from 'bemuse/ui/ModalPopup'
import Options    from 'bemuse/app/ui/Options'

const noop = () => { }

const OptionsPlayground = React.createClass({
  render () {
    return <ModalPopup visible onBackdropClick={noop}>
      <Options onClose={noop} />
    </ModalPopup>
  }
})

export function main () {
  React.render(<OptionsPlayground />, MAIN)
}
