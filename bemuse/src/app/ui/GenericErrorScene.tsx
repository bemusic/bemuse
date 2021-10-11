import './GenericErrorScene.scss'

import React from 'react'
import OptionsButton from './OptionsButton'
import ModalPopup from 'bemuse/ui/ModalPopup'
import Panel from 'bemuse/ui/Panel'
import Scene from 'bemuse/ui/Scene'

import * as Analytics from '../analytics'

export default function GenericErrorScene(props: {
  preamble: string
  error: Error
  onContinue: () => void
}) {
  const { preamble, error, onContinue } = props
  const details = React.useMemo(() => {
    return [
      preamble,
      '',
      '[Error]',
      String(error),
      '',
      '[User agent]',
      navigator.userAgent,
      '',
      '[Stack trace]',
      String((error && error.stack) || error),
    ].join('\n')
  }, [error, preamble])
  return (
    <Scene className='GenericErrorScene'>
      <ModalPopup>
        <Panel title='Error'>
          <div className='GenericErrorSceneのwrapper'>
            <textarea
              className='GenericErrorSceneのstack'
              value={details}
              readOnly
            />

            <div style={{ textAlign: 'right' }}>
              <OptionsButton
                onClick={() => {
                  Analytics.send('error', 'continue', String(error))
                  onContinue()
                }}
              >
                Continue
              </OptionsButton>
            </div>
          </div>
        </Panel>
      </ModalPopup>
    </Scene>
  )
}

GenericErrorScene.getScene = (
  props: React.ComponentPropsWithoutRef<typeof GenericErrorScene>
) => {
  return <GenericErrorScene {...props} />
}
