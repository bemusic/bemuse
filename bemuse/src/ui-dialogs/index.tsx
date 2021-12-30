import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import WARP from 'bemuse/utils/warp-element'
import ModalPopup from 'bemuse/ui/ModalPopup'
import Panel from 'bemuse/ui/Panel'
import Button from 'bemuse/ui/Button'
import VBox from 'bemuse/ui/VBox'

export async function showAlert(title: string, message: ReactNode) {
  await new Promise<void>((resolve) => {
    const container = document.createElement('div')
    WARP.appendChild(container)
    const onClick = () => {
      WARP.removeChild(container)
      ReactDOM.unmountComponentAtNode(container)
      resolve()
    }
    const popup = (
      <ModalPopup>
        <Panel title={title}>
          <VBox padding={'1em'} gap={'0.75em'}>
            <div>{message}</div>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={onClick}>OK</Button>
            </div>
          </VBox>
        </Panel>
      </ModalPopup>
    )
    ReactDOM.render(popup, container)
  })
}
