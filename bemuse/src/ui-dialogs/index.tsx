import './index.scss'

import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import WARP from 'bemuse/utils/warp-element'
import Panel from 'bemuse/ui/Panel'
import Button from 'bemuse/ui/Button'
import VBox from 'bemuse/ui/VBox'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { ComboBox } from './ComboBox'

export async function showAlert(title: string, message: ReactNode) {
  await registerActiveModal(
    new Promise<void>((resolve) => {
      const container = document.createElement('div')
      WARP.appendChild(container)
      const onClick = () => {
        WARP.removeChild(container)
        ReactDOM.unmountComponentAtNode(container)
        resolve()
      }
      const popup = (
        <AlertDialog.Root open>
          <AlertDialog.Overlay className='AlertDialogのoverlay' />
          <AlertDialog.Content className='AlertDialogのcontent'>
            <Panel title={<AlertDialog.Title>{title}</AlertDialog.Title>}>
              <VBox padding={'1em'} gap={'0.75em'}>
                <AlertDialog.Description>{message}</AlertDialog.Description>
                <div style={{ textAlign: 'right' }}>
                  <AlertDialog.Action asChild>
                    <Button onClick={onClick} ref={(b) => b && b.focus()}>
                      OK
                    </Button>
                  </AlertDialog.Action>
                </div>
              </VBox>
            </Panel>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )
      ReactDOM.render(popup, container)
    })
  )
}

export async function showQuickPick<T extends QuickPickItem>(
  items: T[],
  options: QuickPickOptions
) {
  return registerActiveModal(
    new Promise<T>((resolve) => {
      const container = document.createElement('div')
      WARP.appendChild(container)
      const onSelect = (item: T) => {
        WARP.removeChild(container)
        ReactDOM.unmountComponentAtNode(container)
        resolve(item)
      }
      const popup = (
        <AlertDialog.Root open>
          <AlertDialog.Overlay className='AlertDialogのoverlay' />
          <AlertDialog.Content className='AlertDialogのcontent'>
            <Panel
              title={<AlertDialog.Title>{options.title}</AlertDialog.Title>}
            >
              <VBox padding={'1em'} gap={'0.75em'}>
                <ComboBox items={items} onSelect={onSelect} />
              </VBox>
            </Panel>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )
      ReactDOM.render(popup, container)
    })
  )
}

export type QuickPickItem = {
  label: string
}

export type QuickPickOptions = {
  title: string
}

const activeModals = new Set<Promise<any>>()

function registerActiveModal<T extends Promise<any>>(promise: T) {
  activeModals.add(promise)
  Promise.resolve(promise).finally(() => {
    activeModals.delete(promise)
  })
  return promise
}

export function isModalActive() {
  return activeModals.size > 0
}
